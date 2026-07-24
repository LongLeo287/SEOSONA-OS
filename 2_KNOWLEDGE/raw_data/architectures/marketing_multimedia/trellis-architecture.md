# Architecture Extract: TRELLIS

## Directory Structure
```text
TRELLIS/
    .gitignore
    .gitmodules
    app.py
    app_text.py
    CODE_OF_CONDUCT.md
    DATASET.md
    example.py
    example_multi_image.py
    example_text.py
    example_variant.py
    LICENSE
    README.md
    SECURITY.md
    setup.sh
    SUPPORT.md
    train.py
    .github/
        workflows/
            codeql.yml
    assets/
        T.ply
        example_image/
        example_multi_image/
    configs/
        generation/
            slat_flow_img_dit_L_64l8p2_fp16.json
            slat_flow_txt_dit_B_64l8p2_fp16.json
            slat_flow_txt_dit_L_64l8p2_fp16.json
            slat_flow_txt_dit_XL_64l8p2_fp16.json
            ss_flow_img_dit_L_16l8_fp16.json
            ss_flow_txt_dit_B_16l8_fp16.json
            ss_flow_txt_dit_L_16l8_fp16.json
            ss_flow_txt_dit_XL_16l8_fp16.json
        vae/
            slat_vae_dec_mesh_swin8_B_64l8_fp16.json
            slat_vae_dec_rf_swin8_B_64l8_fp16.json
            slat_vae_enc_dec_gs_swin8_B_64l8_fp16.json
            ss_vae_conv3d_16l8_fp16.json
    dataset_toolkits/
        build_metadata.py
        calculate_aesthetic_scores.py
        download.py
        encode_latent.py
        encode_ss_latent.py
        extract_feature.py
        render.py
        render_cond.py
        setup.sh
        stat_latent.py
        utils.py
        voxelize.py
        blender_script/
            io_scene_usdz.zip
            render.py
        datasets/
            3D-FUTURE.py
            ABO.py
            HSSD.py
            ObjaverseXL.py
            Toys4k.py
    trellis/
        __init__.py
        datasets/
            components.py
            sparse_feat2render.py
            sparse_structure.py
            sparse_structure_latent.py
            structured_latent.py
            structured_latent2render.py
            __init__.py
        models/
            sparse_elastic_mixin.py
            sparse_structure_flow.py
            sparse_structure_vae.py
            structured_latent_flow.py
            __init__.py
            structured_latent_vae/
                base.py
                decoder_gs.py
                decoder_mesh.py
                decoder_rf.py
                encoder.py
                __init__.py
        modules/
            norm.py
            spatial.py
            utils.py
            attention/
                full_attn.py
                modules.py
                __init__.py
            sparse/
                basic.py
                linear.py
                nonlinearity.py
                norm.py
                spatial.py
                __init__.py
                attention/
                    full_attn.py
                    modules.py
                    serialized_attn.py
                    windowed_attn.py
                    __init__.py
                conv/
                    conv_spconv.py
                    conv_torchsparse.py
                    __init__.py
                transformer/
                    blocks.py
                    modulated.py
                    __init__.py
            transformer/
                blocks.py
                modulated.py
                __init__.py
        pipelines/
            base.py
            trellis_image_to_3d.py
            trellis_text_to_3d.py
            __init__.py
            samplers/
                base.py
                classifier_free_guidance_mixin.py
                flow_euler.py
                guidance_interval_mixin.py
                __init__.py
        renderers/
            gaussian_render.py
            mesh_renderer.py
            octree_renderer.py
            sh_utils.py
            __init__.py
        representations/
            __init__.py
            gaussian/
                gaussian_model.py
                general_utils.py
                __init__.py
            mesh/
                cube2mesh.py
                utils_cube.py
                __init__.py
                flexicubes/
            octree/
                octree_dfs.py
                __init__.py
            radiance_field/
                strivec.py
                __init__.py
        trainers/
            base.py
            basic.py
            utils.py
            __init__.py
            flow_matching/
                flow_matching.py
                sparse_flow_matching.py
                mixins/
                    classifier_free_guidance.py
                    image_conditioned.py
                    text_conditioned.py
            vae/
                sparse_structure_vae.py
                structured_latent_vae_gaussian.py
                structured_latent_vae_mesh_dec.py
                structured_latent_vae_rf_dec.py
        utils/
            data_utils.py
            dist_utils.py
            elastic_utils.py
            general_utils.py
            grad_clip_utils.py
            loss_utils.py
            postprocessing_utils.py
            random_utils.py
            render_utils.py
            __init__.py
```

## Core Logic Samples

### `app.py`
```
import gradio as gr
from gradio_litmodel3d import LitModel3D

import os
import shutil
from typing import *
import torch
import numpy as np
import imageio
from easydict import EasyDict as edict
from PIL import Image
from trellis.pipelines import TrellisImageTo3DPipeline
from trellis.representations import Gaussian, MeshExtractResult
from trellis.utils import render_utils, postprocessing_utils


MAX_SEED = np.iinfo(np.int32).max
TMP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tmp')
os.makedirs(TMP_DIR, exist_ok=True)


def start_session(req: gr.Request):
    user_dir = os.path.join(TMP_DIR, str(req.session_hash))
    os.makedirs(user_dir, exist_ok=True)
    
    
def end_session(req: gr.Request):
    user_dir = os.path.join(TMP_DIR, str(req.session_hash))
    shutil.rmtree(user_dir)


def preprocess_image(image: Image.Image) -> Image.Image:
    """
    Preprocess the input image.

    Args:
        image (Image.Image): The input image.

    Returns:
        Image.Image: The preprocessed image.
    """
    processed_image = pipeline.preprocess_image(image)
    return processed_image


def preprocess_images(images: List[Tuple[Image.Image, str]]) -> List[Image.Image]:
    """
    Preprocess a list of input images.
    
    Args:
        images (List[Tuple[Image.Image, str]]): The input images.
        
    Returns:
        List[Image.Image]: The preprocessed images.
    """
    images = [image[0] for image in images]
    processed_images = [pipeline.preprocess_image(image) for image in images]
    return processed_images


def pack_state(gs: Gaussian, mesh: MeshExtractResult) -> dict:
    return {
        'gaussian': {
            **gs.init_params,
            '_xyz': gs._xyz.cpu().numpy(),
            '_features_dc': gs._features_dc.cpu().numpy(),
            '_scaling': gs._scaling.cpu().numpy(),
            '_rotation': gs._rotation.cpu().numpy(),
            '_opacity': gs._opacity.cpu().numpy(),
        },
        'mesh': {
            'vertices': mesh.vertices.cpu().numpy(),
            'faces': mesh.faces.cpu().numpy(),
        },
    }
    
    
def unpack_state(state: dict) -> Tuple[Gaussian, edict, str]:
    gs = Gaussian(
        aabb=state['gaussian']['aabb'],
        sh_degree=state['gaussian']['sh_degree'],
        mininum_kernel_size=state['gaussian']['mininum_kernel_size'],
        scaling_bias=state['gaussian']['scaling_bias'],
        opacity_bias=state['gaussian']['opacity_bias'],
        scaling_activation=state['gaussian']['scaling_activation'],
    )
    gs._xyz = torch.tensor(state['gaussian']['_xyz'], device='cuda')
    gs._features_dc = torch.tensor(state['gaussian']['_features_dc'], device='cuda')
    gs._scaling = torch.tensor(state['gaussian']['_scaling'], device='cuda')
    gs._rotation = torch.tensor(state['gaussian']['_rotation'], device='cuda')
    gs._opacity = torch.tensor(state['gaussian']['_opacity'], device='cuda')
    
    mesh = edict(
        vertices=torch.tensor(state['mesh']['vertices'], device='cuda'),
        faces=torch.tensor(state['mesh']['faces'], device='cuda'),
    )
    
    return gs, mesh


def get_seed(randomize_seed: bool, seed: int) -> int:
    """
    Get the random seed.
    """
    return np.random.randint(0, MAX_SEED) if randomize_seed else seed


def image_to_3d(
    image: Image.Image,
    multiimages: List[Tuple[Image.Image, str]],
    is_multiimage: bool,
    seed: int,
    ss_guidance_strength: float,
    ss_sampling_steps: int,
    slat_guidance_strength: float,
    slat_sampling_steps: int,
    multiimage_algo: Literal["multidiffusion", "stochastic"],
    req: gr.Request,
) -> Tuple[dict, str]:
    """
    Convert an image to a 3D model.

    Args:
        image (Image.Image): The input image.
        multiimages (List[Tuple[Image.Image, str]]): The input images in multi-image mode.
        is_multiimage (bool): Whether is in multi-image mode.
        seed (int): The random seed.
        ss_guidance_strength (float): The guidance strength for sparse structure generation.
        ss_sampling_steps (int): The number of sampling steps for sparse structure generation.
        slat_guidance_strength (float): The guidance strength for structured latent generation.
        slat_sampling_steps (int): The number of sampling steps for structured latent generation.
        multiimage_algo (Literal["multidiffusion", "stochastic"]): The algorithm for multi-image generation.

    Returns:
        dict: The information of the generated 3D model.
        str: The path to the video of the 3D model.
    """
    user_dir = os.path.join(TMP_DIR, str(req.session_hash))
    if not is_multiimage:
        outputs = pipeline.run(
            image,
            seed=seed,
            formats=["gaussian", "mesh"],
            preprocess_image=False,
            sparse_structure_sampler_params={
                "steps": ss_sampling_steps,
                "cfg_strength": ss_guidance_strength,
            },
            slat_sampler_params={
                "steps": slat_sampling_steps,
                "cfg_strength": slat_guidance_strength,
            },
        )
    else:
        outputs = pipeline.run_multi_image(
            [image[0] for image in multiimages],
            seed=seed,
            formats=["gaussian", "mesh"],
            preprocess_image=False,
            sparse_structure_sampler_params={
                "steps": ss_sampling_steps,
                "cfg_strength": ss_guidance_strength,
            },
            slat_sampler_params={
                "steps": slat_sampling_steps,
                "cfg_strength": slat_guidance_strength,
            },
            mode=multiimage_algo,
        )
    video = render_utils.render_video(outputs['gaussian'][0], num_frames=120)['color']
    video_geo = render_utils.render_video(outputs['mesh'][0], num_frames=120)['normal']
    video = [np.concatenate([video[i], video_geo[i]], axis=1) for i in range(len(video))]
    video_path = os.path.join(user_dir, 'sample.mp4')
    imageio.mimsave(video_path, video, fps=15)
    state = pack_state(outputs['gaussian'][0], outputs['mesh'][0])
    torch.cuda.empty_cache()
    return state, video_path


def extract_glb(
    state: dict,
    mesh_simplify: float,
    texture_size: int,
    req: gr.Request,
) -> Tuple[str, str]:
    """
    Extract a GLB file from the 3D model.

    Args:
        state (dict): The state of the generated 3D model.
        mesh_simplify (float): The mesh simplification factor.
        texture_size (int): The texture resolution.

    Returns:
        str: The path to the extracted GLB file.
    """
    user_dir = os.path.join(TMP_DIR, str(req.session_hash))
    gs, mesh = unpack_state(state)
    glb = postprocessing_utils.to_glb(gs, mesh, simplify=mesh_simplify, texture_size=texture_size, verbose=False)
    glb_path = os.path.join(user_dir, 'sample.glb')
    glb.export(glb_path)
    torch.cuda.empty_cache()
    return glb_path, glb_path


def extract_gaussian(state: dict, req: gr.Request) -> Tuple[str, str]:
    """
    Extract a Gaussian file from the 3D model.

    Args:
        state (dict): The state of the generated 3D model.

    Returns:
        str: The path to the extracted Gaussian file.
    """
    user_dir = os.path.join(TMP_DIR, str(req.session_hash))
    gs, _ = unpack_state(state)
    gaussian_path = os.path.join(user_dir, 'sample.ply')
    gs.save_ply(gaussian_path)
    torch.cuda.empty_cache()
    return gaussian_path, gaussian_path


def prepare_multi_example() -> List[Image.Image]:
    multi_case = list(set([i.split('_')[0] for i in os.listdir("assets/example_multi_image")]))
    images = []
    for case in multi_case:
        _images = []
        for i in range(1, 4):
            img = Image.open(f'assets/example_multi_image/{case}_{i}.png')
            W, H = img.size
            img = img.resize((int(W / H * 512), 512))
            _images.append(np.array(img))
        images.append(Image.fromarray(np.concatenate(_images, axis=1)))
    return images


def split_image(image: Image.Image) -> List[Image.Image]:
    """
    Split an image into multiple views.
    """
    image = np.array(image)
    alpha = image[..., 3]
    alpha = np.any(alpha>0, axis=0)
    start_pos = np.where(~alpha[:-1] & alpha[1:])[0].tolist()
    end_pos = np.where(alpha[:-1] & ~alpha[1:])[0].tolist()
    images = []
    for s, e in zip(start_pos, end_pos):
        images.append(Image.fromarray(image[:, s:e+1]))
    return [preprocess_image(image) for image in images]


with gr.Blocks(delete_cache=(600, 600)) as demo:
    gr.Markdown("""
    ## Image to 3D Asset with [TRELLIS](https://trellis3d.github.io/)
    * Upload an image and click "Generate" to create a 3D asset. If the image has alpha channel, it be used as the mask. Otherwise, we use `rembg` to remove the background.
    * If you find the generated 3D asset satisfactory, click "Extract GLB" to extract the GLB file and download it.
    """)
    
    with gr.Row():
        with gr.Column():
            with gr.Tabs() as input_tabs:
                with gr.Tab(label="Single Image", id=0) as single_image_input_tab:
                    image_prompt = gr.Image(label="Image Prompt", format="png", image_mode="RGBA", type="pil", height=300)
                with gr.Tab(label="Multiple Images", id=1) as multiimage_input_tab:
                    multiimage_prompt = gr.Gallery(label="Image Prompt", format="png", type="pil", height=300, columns=3)
                    gr.Markdown("""
                        Input different views of the object in separate images. 
                        
                        *NOTE: this is an experimental algorithm without training a specialized model. It may not produce the best results for all images, especially those having different poses or inconsistent details.*
                    """)
            
            with gr.Accordion(label="Generation Settings", open=False):
                seed = gr.Slider(0, MAX_SEED, label="Seed", value=0, step=1)
                randomize_seed = gr.Checkbox(label="Randomize Seed", value=True)
                gr.Markdown("Stage 1: Sparse Structure Generation")
                with gr.Row():
                    ss_guidance_strength = gr.Slider(0.0, 10.0, label="Guidance Strength", value=7.5, step=0.1)
                    ss_sampling_steps = gr.Slider(1, 50, label="Sampling Steps", value=12, step=1)
                gr.Markdown("Stage 2: Structured Latent Generation")
                with gr.Row():
                    slat_guidance_strength = gr.Slider(0.0, 10.0, label="Guidance Strength", value=3.0, step=0.1)
                    slat_sampling_steps = gr.Slider(1, 50, label="Sampling Steps", value=12, step=1)
                multiimage_algo = gr.Radio(["stochastic", "multidiffusion"], label="Multi-image Algorithm", value="stochastic")

            generate_btn = gr.Button("Generate")
            
            with gr.Accordion(label="GLB Extraction Settings", open=False):
                mesh_simplify = gr.Slider(0.9, 0.98, label="Simplify", value=0.95, step=0.01)
                texture_size = gr.Slider(512, 2048, label="Texture Size", value=1024, step=512)
            
            with gr.Row():
                extract_glb_btn = gr.Button("Extract GLB", interactive=False)
                extract_gs_btn = gr.Button("Extract Gaussian", interactive=False)
            gr.Markdown("""
                        *NOTE: Gaussian file can be very large (~50MB), it will take a while to display and download.*
                        """)

        with gr.Column():
            video_output = gr.Video(label="Generated 3D Asset", autoplay=True, loop=True, height=300)

... [TRUNCATED] ...
```

### `app_text.py`
```
import gradio as gr
from gradio_litmodel3d import LitModel3D

import os
import shutil
from typing import *
import torch
import numpy as np
import imageio
from easydict import EasyDict as edict
from trellis.pipelines import TrellisTextTo3DPipeline
from trellis.representations import Gaussian, MeshExtractResult
from trellis.utils import render_utils, postprocessing_utils


MAX_SEED = np.iinfo(np.int32).max
TMP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tmp')
os.makedirs(TMP_DIR, exist_ok=True)


def start_session(req: gr.Request):
    user_dir = os.path.join(TMP_DIR, str(req.session_hash))
    os.makedirs(user_dir, exist_ok=True)
    
    
def end_session(req: gr.Request):
    user_dir = os.path.join(TMP_DIR, str(req.session_hash))
    shutil.rmtree(user_dir)


def pack_state(gs: Gaussian, mesh: MeshExtractResult) -> dict:
    return {
        'gaussian': {
            **gs.init_params,
            '_xyz': gs._xyz.cpu().numpy(),
            '_features_dc': gs._features_dc.cpu().numpy(),
            '_scaling': gs._scaling.cpu().numpy(),
            '_rotation': gs._rotation.cpu().numpy(),
            '_opacity': gs._opacity.cpu().numpy(),
        },
        'mesh': {
            'vertices': mesh.vertices.cpu().numpy(),
            'faces': mesh.faces.cpu().numpy(),
        },
    }
    
    
def unpack_state(state: dict) -> Tuple[Gaussian, edict, str]:
    gs = Gaussian(
        aabb=state['gaussian']['aabb'],
        sh_degree=state['gaussian']['sh_degree'],
        mininum_kernel_size=state['gaussian']['mininum_kernel_size'],
        scaling_bias=state['gaussian']['scaling_bias'],
        opacity_bias=state['gaussian']['opacity_bias'],
        scaling_activation=state['gaussian']['scaling_activation'],
    )
    gs._xyz = torch.tensor(state['gaussian']['_xyz'], device='cuda')
    gs._features_dc = torch.tensor(state['gaussian']['_features_dc'], device='cuda')
    gs._scaling = torch.tensor(state['gaussian']['_scaling'], device='cuda')
    gs._rotation = torch.tensor(state['gaussian']['_rotation'], device='cuda')
    gs._opacity = torch.tensor(state['gaussian']['_opacity'], device='cuda')
    
    mesh = edict(
        vertices=torch.tensor(state['mesh']['vertices'], device='cuda'),
        faces=torch.tensor(state['mesh']['faces'], device='cuda'),
    )
    
    return gs, mesh


def get_seed(randomize_seed: bool, seed: int) -> int:
    """
    Get the random seed.
    """
    return np.random.randint(0, MAX_SEED) if randomize_seed else seed


def text_to_3d(
    prompt: str,
    seed: int,
    ss_guidance_strength: float,
    ss_sampling_steps: int,
    slat_guidance_strength: float,
    slat_sampling_steps: int,
    req: gr.Request,
) -> Tuple[dict, str]:
    """
    Convert an text prompt to a 3D model.

    Args:
        prompt (str): The text prompt.
        seed (int): The random seed.
        ss_guidance_strength (float): The guidance strength for sparse structure generation.
        ss_sampling_steps (int): The number of sampling steps for sparse structure generation.
        slat_guidance_strength (float): The guidance strength for structured latent generation.
        slat_sampling_steps (int): The number of sampling steps for structured latent generation.

    Returns:
        dict: The information of the generated 3D model.
        str: The path to the video of the 3D model.
    """
    user_dir = os.path.join(TMP_DIR, str(req.session_hash))
    outputs = pipeline.run(
        prompt,
        seed=seed,
        formats=["gaussian", "mesh"],
        sparse_structure_sampler_params={
            "steps": ss_sampling_steps,
            "cfg_strength": ss_guidance_strength,
        },
        slat_sampler_params={
            "steps": slat_sampling_steps,
            "cfg_strength": slat_guidance_strength,
        },
    )
    video = render_utils.render_video(outputs['gaussian'][0], num_frames=120)['color']
    video_geo = render_utils.render_video(outputs['mesh'][0], num_frames=120)['normal']
    video = [np.concatenate([video[i], video_geo[i]], axis=1) for i in range(len(video))]
    video_path = os.path.join(user_dir, 'sample.mp4')
    imageio.mimsave(video_path, video, fps=15)
    state = pack_state(outputs['gaussian'][0], outputs['mesh'][0])
    torch.cuda.empty_cache()
    return state, video_path


def extract_glb(
    state: dict,
    mesh_simplify: float,
    texture_size: int,
    req: gr.Request,
) -> Tuple[str, str]:
    """
    Extract a GLB file from the 3D model.

    Args:
        state (dict): The state of the generated 3D model.
        mesh_simplify (float): The mesh simplification factor.
        texture_size (int): The texture resolution.

    Returns:
        str: The path to the extracted GLB file.
    """
    user_dir = os.path.join(TMP_DIR, str(req.session_hash))
    gs, mesh = unpack_state(state)
    glb = postprocessing_utils.to_glb(gs, mesh, simplify=mesh_simplify, texture_size=texture_size, verbose=False)
    glb_path = os.path.join(user_dir, 'sample.glb')
    glb.export(glb_path)
    torch.cuda.empty_cache()
    return glb_path, glb_path


def extract_gaussian(state: dict, req: gr.Request) -> Tuple[str, str]:
    """
    Extract a Gaussian file from the 3D model.

    Args:
        state (dict): The state of the generated 3D model.

    Returns:
        str: The path to the extracted Gaussian file.
    """
    user_dir = os.path.join(TMP_DIR, str(req.session_hash))
    gs, _ = unpack_state(state)
    gaussian_path = os.path.join(user_dir, 'sample.ply')
    gs.save_ply(gaussian_path)
    torch.cuda.empty_cache()
    return gaussian_path, gaussian_path


with gr.Blocks(delete_cache=(600, 600)) as demo:
    gr.Markdown("""
    ## Text to 3D Asset with [TRELLIS](https://trellis3d.github.io/)
    * Type a text prompt and click "Generate" to create a 3D asset.
    * If you find the generated 3D asset satisfactory, click "Extract GLB" to extract the GLB file and download it.
    """)
    
    with gr.Row():
        with gr.Column():
            text_prompt = gr.Textbox(label="Text Prompt", lines=5)
            
            with gr.Accordion(label="Generation Settings", open=False):
                seed = gr.Slider(0, MAX_SEED, label="Seed", value=0, step=1)
                randomize_seed = gr.Checkbox(label="Randomize Seed", value=True)
                gr.Markdown("Stage 1: Sparse Structure Generation")
                with gr.Row():
                    ss_guidance_strength = gr.Slider(0.0, 10.0, label="Guidance Strength", value=7.5, step=0.1)
                    ss_sampling_steps = gr.Slider(1, 50, label="Sampling Steps", value=25, step=1)
                gr.Markdown("Stage 2: Structured Latent Generation")
                with gr.Row():
                    slat_guidance_strength = gr.Slider(0.0, 10.0, label="Guidance Strength", value=7.5, step=0.1)
                    slat_sampling_steps = gr.Slider(1, 50, label="Sampling Steps", value=25, step=1)

            generate_btn = gr.Button("Generate")
            
            with gr.Accordion(label="GLB Extraction Settings", open=False):
                mesh_simplify = gr.Slider(0.9, 0.98, label="Simplify", value=0.95, step=0.01)
                texture_size = gr.Slider(512, 2048, label="Texture Size", value=1024, step=512)
            
            with gr.Row():
                extract_glb_btn = gr.Button("Extract GLB", interactive=False)
                extract_gs_btn = gr.Button("Extract Gaussian", interactive=False)
            gr.Markdown("""
                        *NOTE: Gaussian file can be very large (~50MB), it will take a while to display and download.*
                        """)

        with gr.Column():
            video_output = gr.Video(label="Generated 3D Asset", autoplay=True, loop=True, height=300)
            model_output = LitModel3D(label="Extracted GLB/Gaussian", exposure=10.0, height=300)
            
            with gr.Row():
                download_glb = gr.DownloadButton(label="Download GLB", interactive=False)
                download_gs = gr.DownloadButton(label="Download Gaussian", interactive=False)  
    
    output_buf = gr.State()

    # Handlers
    demo.load(start_session)
    demo.unload(end_session)

    generate_btn.click(
        get_seed,
        inputs=[randomize_seed, seed],
        outputs=[seed],
    ).then(
        text_to_3d,
        inputs=[text_prompt, seed, ss_guidance_strength, ss_sampling_steps, slat_guidance_strength, slat_sampling_steps],
        outputs=[output_buf, video_output],
    ).then(
        lambda: tuple([gr.Button(interactive=True), gr.Button(interactive=True)]),
        outputs=[extract_glb_btn, extract_gs_btn],
    )

    video_output.clear(
        lambda: tuple([gr.Button(interactive=False), gr.Button(interactive=False)]),
        outputs=[extract_glb_btn, extract_gs_btn],
    )

    extract_glb_btn.click(
        extract_glb,
        inputs=[output_buf, mesh_simplify, texture_size],
        outputs=[model_output, download_glb],
    ).then(
        lambda: gr.Button(interactive=True),
        outputs=[download_glb],
    )
    
    extract_gs_btn.click(
        extract_gaussian,
        inputs=[output_buf],
        outputs=[model_output, download_gs],
    ).then(
        lambda: gr.Button(interactive=True),
        outputs=[download_gs],
    )

    model_output.clear(
        lambda: gr.Button(interactive=False),
        outputs=[download_glb],
    )
    

# Launch the Gradio app
if __name__ == "__main__":
    pipeline = TrellisTextTo3DPipeline.from_pretrained("microsoft/TRELLIS-text-xlarge")
    pipeline.cuda()
    demo.launch()
```

### `CODE_OF_CONDUCT.md`
```
# Microsoft Open Source Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

Resources:

- [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/)
- [Microsoft Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/)
- Contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with questions or concerns
```

### `DATASET.md`
```
# TRELLIS-500K

TRELLIS-500K is a dataset of 500K 3D assets curated from [Objaverse(XL)](https://objaverse.allenai.org/), [ABO](https://amazon-berkeley-objects.s3.amazonaws.com/index.html), [3D-FUTURE](https://tianchi.aliyun.com/specials/promotion/alibaba-3d-future), [HSSD](https://huggingface.co/datasets/hssd/hssd-models), and [Toys4k](https://github.com/rehg-lab/lowshot-shapebias/tree/main/toys4k), filtered based on aesthetic scores.
This dataset serves for 3D generation tasks.

The dataset is provided as csv files containing the 3D assets' metadata.

## Dataset Statistics

The following table summarizes the dataset's filtering and composition:

***NOTE: Some of the 3D assets lack text captions. Please filter out such assets if captions are required.***
| Source | Aesthetic Score Threshold | Filtered Size | With Captions |
|:-:|:-:|:-:|:-:|
| ObjaverseXL (sketchfab) | 5.5 | 168307 | 167638 |
| ObjaverseXL (github) | 5.5 | 311843 | 306790 |
| ABO | 4.5 | 4485 | 4390 |
| 3D-FUTURE | 4.5 | 9472 | 9291 |
| HSSD | 4.5 | 6670 | 6661 |
| All (training set) | - | 500777 | 494770 |
| Toys4k (evaluation set) | 4.5 | 3229 | 3180 |

## Dataset Location

The dataset is hosted on Hugging Face Datasets. You can preview the dataset at

[https://huggingface.co/datasets/JeffreyXiang/TRELLIS-500K](https://huggingface.co/datasets/JeffreyXiang/TRELLIS-500K)

There is no need to download the csv files manually. We provide toolkits to load and prepare the dataset.

## Dataset Toolkits

We provide [toolkits](dataset_toolkits) for data preparation.

### Step 1: Install Dependencies

```
. ./dataset_toolkits/setup.sh
```

### Step 2: Load Metadata

First, we need to load the metadata of the dataset.

```
python dataset_toolkits/build_metadata.py <SUBSET> --output_dir <OUTPUT_DIR> [--source <SOURCE>]
```

- `SUBSET`: The subset of the dataset to load. Options are `ObjaverseXL`, `ABO`, `3D-FUTURE`, `HSSD`, and `Toys4k`.
- `OUTPUT_DIR`: The directory to save the data.
- `SOURCE`: Required if `SUBSET` is `ObjaverseXL`. Options are `sketchfab` and `github`.

For example, to load the metadata of the ObjaverseXL (sketchfab) subset and save it to `datasets/ObjaverseXL_sketchfab`, we can run:

```
python dataset_toolkits/build_metadata.py ObjaverseXL --source sketchfab --output_dir datasets/ObjaverseXL_sketchfab
```

### Step 3: Download Data

Next, we need to download the 3D assets.

```
python dataset_toolkits/download.py <SUBSET> --output_dir <OUTPUT_DIR> [--rank <RANK> --world_size <WORLD_SIZE>]
```

- `SUBSET`: The subset of the dataset to download. Options are `ObjaverseXL`, `ABO`, `3D-FUTURE`, `HSSD`, and `Toys4k`.
- `OUTPUT_DIR`: The directory to save the data.

You can also specify the `RANK` and `WORLD_SIZE` of the current process if you are using multiple nodes for data preparation.

For example, to download the ObjaverseXL (sketchfab) subset and save it to `datasets/ObjaverseXL_sketchfab`, we can run: 

***NOTE: The example command below sets a large `WORLD_SIZE` for demonstration purposes. Only a small portion of the dataset will be downloaded.***

```
python dataset_toolkits/download.py ObjaverseXL --output_dir datasets/ObjaverseXL_sketchfab --world_size 160000
```

Some datasets may require interactive login to Hugging Face or manual downloading. Please follow the instructions given by the toolkits.

After downloading, update the metadata file with:

```
python dataset_toolkits/build_metadata.py ObjaverseXL --output_dir datasets/ObjaverseXL_sketchfab
```

### Step 4: Render Multiview Images (& Calculate Aesthetic Scores)

Multiview images can be rendered with:

```
python dataset_toolkits/render.py <SUBSET> --output_dir <OUTPUT_DIR> [--num_views <NUM_VIEWS>] [--rank <RANK> --world_size <WORLD_SIZE>]
```

- `SUBSET`: The subset of the dataset to render. Options are `ObjaverseXL`, `ABO`, `3D-FUTURE`, `HSSD`, and `Toys4k`.
- `OUTPUT_DIR`: The directory to save the data.
- `NUM_VIEWS`: The number of views to render. Default is 150.
- `RANK` and `WORLD_SIZE`: Multi-node configuration.

For example, to render the ObjaverseXL (sketchfab) subset and save it to `datasets/ObjaverseXL_sketchfab`, we can run:

```
python dataset_toolkits/render.py ObjaverseXL --output_dir datasets/ObjaverseXL_sketchfab
```

(Optional) If you want to calculate the aesthetic scores of your own rendered datasets, you can use the following command:

```
python dataset_toolkits/calculate_aesthetic_scores.py --output_dir <OUTPUT_DIR> [--rank <RANK> --world_size <WORLD_SIZE>]
```
- `OUTPUT_DIR`: The directory to save the data.
- `RANK` and `WORLD_SIZE`: Multi-node configuration.

Don't forget to update the metadata file with:

```
python dataset_toolkits/build_metadata.py ObjaverseXL --output_dir datasets/ObjaverseXL_sketchfab
```

### Step 5: Voxelize 3D Models

We can voxelize the 3D models with:

```
python dataset_toolkits/voxelize.py <SUBSET> --output_dir <OUTPUT_DIR> [--rank <RANK> --world_size <WORLD_SIZE>]
```

- `SUBSET`: The subset of the dataset to voxelize. Options are `ObjaverseXL`, `ABO`, `3D-FUTURE`, `HSSD`, and `Toys4k`.
- `OUTPUT_DIR`: The directory to save the data.
- `RANK` and `WORLD_SIZE`: Multi-node configuration.

For example, to voxelize the ObjaverseXL (sketchfab) subset and save it to `datasets/ObjaverseXL_sketchfab`, we can run:
```
python dataset_toolkits/voxelize.py ObjaverseXL --output_dir datasets/ObjaverseXL_sketchfab
```

Then update the metadata file with:

```
python dataset_toolkits/build_metadata.py ObjaverseXL --output_dir datasets/ObjaverseXL_sketchfab
```

### Step 6: Extract DINO Features

To prepare the training data for SLat VAE, we need to extract DINO features from multiview images and aggregate them into sparse voxel grids.

```
python dataset_toolkits/extract_features.py --output_dir <OUTPUT_DIR> [--rank <RANK> --world_size <WORLD_SIZE>]
```

- `OUTPUT_DIR`: The directory to save the data.
- `RANK` and `WORLD_SIZE`: Multi-node configuration.


For example, to extract DINO features from the ObjaverseXL (sketchfab) subset and save it to `datasets/ObjaverseXL_sketchfab`, we can run:

```
python dataset_toolkits/extract_feature.py --output_dir datasets/ObjaverseXL_sketchfab
```

Then update the metadata file with:

```
python dataset_toolkits/build_metadata.py ObjaverseXL --output_dir datasets/ObjaverseXL_sketchfab
```

### Step 7: Encode Sparse Structures

Encoding the sparse structures into latents to train the first stage generator:

```
python dataset_toolkits/encode_ss_latent.py --output_dir <OUTPUT_DIR> [--rank <RANK> --world_size <WORLD_SIZE>]
```

- `OUTPUT_DIR`: The directory to save the data.
- `RANK` and `WORLD_SIZE`: Multi-node configuration.

For example, to encode the sparse structures into latents for the ObjaverseXL (sketchfab) subset and save it to `datasets/ObjaverseXL_sketchfab`, we can run:

```
python dataset_toolkits/encode_ss_latent.py --output_dir datasets/ObjaverseXL_sketchfab
```

Then update the metadata file with:

```
python dataset_toolkits/build_metadata.py ObjaverseXL --output_dir datasets/ObjaverseXL_sketchfab
```

### Step 8: Encode SLat

Encoding SLat for second stage generator training:

```
python dataset_toolkits/encode_latent.py --output_dir <OUTPUT_DIR> [--rank <RANK> --world_size <WORLD_SIZE>]
```

- `OUTPUT_DIR`: The directory to save the data.
- `RANK` and `WORLD_SIZE`: Multi-node configuration.

For example, to encode SLat for the ObjaverseXL (sketchfab) subset and save it to `datasets/ObjaverseXL_sketchfab`, we can run:

```
python dataset_toolkits/encode_latent.py --output_dir datasets/ObjaverseXL_sketchfab
```

Then update the metadata file with:

```
python dataset_toolkits/build_metadata.py ObjaverseXL --output_dir datasets/ObjaverseXL_sketchfab
```

### Step 9: Render Image Conditions

To train the image conditioned generator, we need to render image conditions with augmented views.

```
python dataset_toolkits/render_cond.py <SUBSET> --output_dir <OUTPUT_DIR> [--num_views <NUM_VIEWS>] [--rank <RANK> --world_size <WORLD_SIZE>]
```

- `SUBSET`: The subset of the dataset to render. Options are `ObjaverseXL`, `ABO`, `3D-FUTURE`, `HSSD`, and `Toys4k`.
- `OUTPUT_DIR`: The directory to save the data.
- `NUM_VIEWS`: The number of views to render. Default is 24.
- `RANK` and `WORLD_SIZE`: Multi-node configuration.

For example, to render image conditions for the ObjaverseXL (sketchfab) subset and save it to `datasets/ObjaverseXL_sketchfab`, we can run:

```
python dataset_toolkits/render_cond.py ObjaverseXL --output_dir datasets/ObjaverseXL_sketchfab
```

Then update the metadata file with:

```
python dataset_toolkits/build_metadata.py ObjaverseXL --output_dir datasets/ObjaverseXL_sketchfab
```


```

### `example.py`
```
import os
# os.environ['ATTN_BACKEND'] = 'xformers'   # Can be 'flash-attn' or 'xformers', default is 'flash-attn'
os.environ['SPCONV_ALGO'] = 'native'        # Can be 'native' or 'auto', default is 'auto'.
                                            # 'auto' is faster but will do benchmarking at the beginning.
                                            # Recommended to set to 'native' if run only once.

import imageio
from PIL import Image
from trellis.pipelines import TrellisImageTo3DPipeline
from trellis.utils import render_utils, postprocessing_utils

# Load a pipeline from a model folder or a Hugging Face model hub.
pipeline = TrellisImageTo3DPipeline.from_pretrained("microsoft/TRELLIS-image-large")
pipeline.cuda()

# Load an image
image = Image.open("assets/example_image/T.png")

# Run the pipeline
outputs = pipeline.run(
    image,
    seed=1,
    # Optional parameters
    # sparse_structure_sampler_params={
    #     "steps": 12,
    #     "cfg_strength": 7.5,
    # },
    # slat_sampler_params={
    #     "steps": 12,
    #     "cfg_strength": 3,
    # },
)
# outputs is a dictionary containing generated 3D assets in different formats:
# - outputs['gaussian']: a list of 3D Gaussians
# - outputs['radiance_field']: a list of radiance fields
# - outputs['mesh']: a list of meshes

# Render the outputs
video = render_utils.render_video(outputs['gaussian'][0])['color']
imageio.mimsave("sample_gs.mp4", video, fps=30)
video = render_utils.render_video(outputs['radiance_field'][0])['color']
imageio.mimsave("sample_rf.mp4", video, fps=30)
video = render_utils.render_video(outputs['mesh'][0])['normal']
imageio.mimsave("sample_mesh.mp4", video, fps=30)

# GLB files can be extracted from the outputs
glb = postprocessing_utils.to_glb(
    outputs['gaussian'][0],
    outputs['mesh'][0],
    # Optional parameters
    simplify=0.95,          # Ratio of triangles to remove in the simplification process
    texture_size=1024,      # Size of the texture used for the GLB
)
glb.export("sample.glb")

# Save Gaussians as PLY files
outputs['gaussian'][0].save_ply("sample.ply")
```

### `example_multi_image.py`
```
import os
# os.environ['ATTN_BACKEND'] = 'xformers'   # Can be 'flash-attn' or 'xformers', default is 'flash-attn'
os.environ['SPCONV_ALGO'] = 'native'        # Can be 'native' or 'auto', default is 'auto'.
                                            # 'auto' is faster but will do benchmarking at the beginning.
                                            # Recommended to set to 'native' if run only once.

import numpy as np
import imageio
from PIL import Image
from trellis.pipelines import TrellisImageTo3DPipeline
from trellis.utils import render_utils

# Load a pipeline from a model folder or a Hugging Face model hub.
pipeline = TrellisImageTo3DPipeline.from_pretrained("microsoft/TRELLIS-image-large")
pipeline.cuda()

# Load an image
images = [
    Image.open("assets/example_multi_image/character_1.png"),
    Image.open("assets/example_multi_image/character_2.png"),
    Image.open("assets/example_multi_image/character_3.png"),
]

# Run the pipeline
outputs = pipeline.run_multi_image(
    images,
    seed=1,
    # Optional parameters
    sparse_structure_sampler_params={
        "steps": 12,
        "cfg_strength": 7.5,
    },
    slat_sampler_params={
        "steps": 12,
        "cfg_strength": 3,
    },
)
# outputs is a dictionary containing generated 3D assets in different formats:
# - outputs['gaussian']: a list of 3D Gaussians
# - outputs['radiance_field']: a list of radiance fields
# - outputs['mesh']: a list of meshes

video_gs = render_utils.render_video(outputs['gaussian'][0])['color']
video_mesh = render_utils.render_video(outputs['mesh'][0])['normal']
video = [np.concatenate([frame_gs, frame_mesh], axis=1) for frame_gs, frame_mesh in zip(video_gs, video_mesh)]
imageio.mimsave("sample_multi.mp4", video, fps=30)
```

### `example_text.py`
```
import os
# os.environ['ATTN_BACKEND'] = 'xformers'   # Can be 'flash-attn' or 'xformers', default is 'flash-attn'
os.environ['SPCONV_ALGO'] = 'native'        # Can be 'native' or 'auto', default is 'auto'.
                                            # 'auto' is faster but will do benchmarking at the beginning.
                                            # Recommended to set to 'native' if run only once.

import imageio
from trellis.pipelines import TrellisTextTo3DPipeline
from trellis.utils import render_utils, postprocessing_utils

# Load a pipeline from a model folder or a Hugging Face model hub.
pipeline = TrellisTextTo3DPipeline.from_pretrained("microsoft/TRELLIS-text-xlarge")
pipeline.cuda()

# Run the pipeline
outputs = pipeline.run(
    "A chair looking like a avocado.",
    seed=1,
    # Optional parameters
    # sparse_structure_sampler_params={
    #     "steps": 12,
    #     "cfg_strength": 7.5,
    # },
    # slat_sampler_params={
    #     "steps": 12,
    #     "cfg_strength": 7.5,
    # },
)
# outputs is a dictionary containing generated 3D assets in different formats:
# - outputs['gaussian']: a list of 3D Gaussians
# - outputs['radiance_field']: a list of radiance fields
# - outputs['mesh']: a list of meshes

# Render the outputs
video = render_utils.render_video(outputs['gaussian'][0])['color']
imageio.mimsave("sample_gs.mp4", video, fps=30)
video = render_utils.render_video(outputs['radiance_field'][0])['color']
imageio.mimsave("sample_rf.mp4", video, fps=30)
video = render_utils.render_video(outputs['mesh'][0])['normal']
imageio.mimsave("sample_mesh.mp4", video, fps=30)

# GLB files can be extracted from the outputs
glb = postprocessing_utils.to_glb(
    outputs['gaussian'][0],
    outputs['mesh'][0],
    # Optional parameters
    simplify=0.95,          # Ratio of triangles to remove in the simplification process
    texture_size=1024,      # Size of the texture used for the GLB
)
glb.export("sample.glb")

# Save Gaussians as PLY files
outputs['gaussian'][0].save_ply("sample.ply")
```

### `example_variant.py`
```
import os
# os.environ['ATTN_BACKEND'] = 'xformers'   # Can be 'flash-attn' or 'xformers', default is 'flash-attn'
os.environ['SPCONV_ALGO'] = 'native'        # Can be 'native' or 'auto', default is 'auto'.
                                            # 'auto' is faster but will do benchmarking at the beginning.
                                            # Recommended to set to 'native' if run only once.

import imageio
import numpy as np
import open3d as o3d
from trellis.pipelines import TrellisTextTo3DPipeline
from trellis.utils import render_utils, postprocessing_utils

# Load a pipeline from a model folder or a Hugging Face model hub.
pipeline = TrellisTextTo3DPipeline.from_pretrained("microsoft/TRELLIS-text-xlarge")
pipeline.cuda()

# Load mesh to make variants
base_mesh = o3d.io.read_triangle_mesh("assets/T.ply")

# Run the pipeline
outputs = pipeline.run_variant(
    base_mesh,
    "Rugged, metallic texture with orange and white paint finish, suggesting a durable, industrial feel.",
    seed=1,
    # Optional parameters
    # slat_sampler_params={
    #     "steps": 12,
    #     "cfg_strength": 7.5,
    # },
)
# outputs is a dictionary containing generated 3D assets in different formats:
# - outputs['gaussian']: a list of 3D Gaussians
# - outputs['radiance_field']: a list of radiance fields
# - outputs['mesh']: a list of meshes

# Render the outputs
video_gs = render_utils.render_video(outputs['gaussian'][0])['color']
video_mesh = render_utils.render_video(outputs['mesh'][0])['normal']
video = [np.concatenate([frame_gs, frame_mesh], axis=1) for frame_gs, frame_mesh in zip(video_gs, video_mesh)]
imageio.mimsave("sample_variant.mp4", video, fps=30)

```

### `README.md`
```
<img src="assets/logo.webp" width="100%" align="center">
<h1 align="center">Structured 3D Latents<br>for Scalable and Versatile 3D Generation</h1>
<p align="center"><a href="https://arxiv.org/abs/2412.01506"><img src='https://img.shields.io/badge/arXiv-Paper-red?logo=arxiv&logoColor=white' alt='arXiv'></a>
<a href='https://microsoft.github.io/TRELLIS/'><img src='https://img.shields.io/badge/Project_Page-Website-green?logo=googlechrome&logoColor=white' alt='Project Page'></a>
<a href='https://huggingface.co/spaces/Microsoft/TRELLIS'><img src='https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Live_Demo-blue'></a>
</p>
<p align="center"><img src="assets/teaser.png" width="100%"></p>

<span style="font-size: 16px; font-weight: 600;">T</span><span style="font-size: 12px; font-weight: 700;">RELLIS</span> is a large 3D asset generation model. It takes in text or image prompts and generates high-quality 3D assets in various formats, such as Radiance Fields, 3D Gaussians, and meshes. The cornerstone of <span style="font-size: 16px; font-weight: 600;">T</span><span style="font-size: 12px; font-weight: 700;">RELLIS</span> is a unified Structured LATent (<span style="font-size: 16px; font-weight: 600;">SL</span><span style="font-size: 12px; font-weight: 700;">AT</span>) representation that allows decoding to different output formats and Rectified Flow Transformers tailored for <span style="font-size: 16px; font-weight: 600;">SL</span><span style="font-size: 12px; font-weight: 700;">AT</span> as the powerful backbones. We provide large-scale pre-trained models with up to 2 billion parameters on a large 3D asset dataset of 500K diverse objects. <span style="font-size: 16px; font-weight: 600;">T</span><span style="font-size: 12px; font-weight: 700;">RELLIS</span> significantly surpasses existing methods, including recent ones at similar scales, and showcases flexible output format selection and local 3D editing capabilities which were not offered by previous models.

***Check out our [Project Page](https://microsoft.github.io/TRELLIS/) for more videos and interactive demos!***

<!-- Features -->
## 🌟 Features
- **High Quality**: It produces diverse 3D assets at high quality with intricate shape and texture details.
- **Versatility**: It takes text or image prompts and can generate various final 3D representations including but not limited to *Radiance Fields*, *3D Gaussians*, and *meshes*, accommodating diverse downstream requirements.
- **Flexible Editing**: It allows for easy editings of generated 3D assets, such as generating variants of the same object or local editing of the 3D asset.

<!-- Updates -->
## ⏩ Updates

**03/25/2025**
- Release training code.
- Release **TRELLIS-text** models and asset variants generation.
  - Examples are provided as [example_text.py](example_text.py) and [example_variant.py](example_variant.py).
  - Gradio demo is provided as [app_text.py](app_text.py).
  - *Note: It is always recommended to do text to 3D generation by first generating images using text-to-image models and then using TRELLIS-image models for 3D generation. Text-conditioned models are less creative and detailed due to data limitations.*

**12/26/2024**
- Release [**TRELLIS-500K**](https://github.com/microsoft/TRELLIS#-dataset) dataset and toolkits for data preparation.

**12/18/2024**
- Implementation of multi-image conditioning for **TRELLIS-image** model. ([#7](https://github.com/microsoft/TRELLIS/issues/7)). This is based on tuning-free algorithm without training a specialized model, so it may not give the best results for all input images.
- Add Gaussian export in `app.py` and `example.py`. ([#40](https://github.com/microsoft/TRELLIS/issues/40))

<!-- Installation -->
## 📦 Installation

### Prerequisites
- **System**: The code is currently tested only on **Linux**.  For windows setup, you may refer to [#3](https://github.com/microsoft/TRELLIS/issues/3) (not fully tested).
- **Hardware**: An NVIDIA GPU with at least 16GB of memory is necessary. The code has been verified on NVIDIA A100 and A6000 GPUs.  
- **Software**:   
  - The [CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit-archive) is needed to compile certain submodules. The code has been tested with CUDA versions 11.8 and 12.2.  
  - [Conda](https://docs.anaconda.com/miniconda/install/#quick-command-line-install) is recommended for managing dependencies.  
  - Python version 3.8 or higher is required. 

### Installation Steps
1. Clone the repo:
    ```sh
    git clone --recurse-submodules https://github.com/microsoft/TRELLIS.git
    cd TRELLIS
    ```

2. Install the dependencies:
    
    **Before running the following command there are somethings to note:**
    - By adding `--new-env`, a new conda environment named `trellis` will be created. If you want to use an existing conda environment, please remove this flag.
    - By default the `trellis` environment will use pytorch 2.4.0 with CUDA 11.8. If you want to use a different version of CUDA (e.g., if you have CUDA Toolkit 12.2 installed and do not want to install another 11.8 version for submodule compilation), you can remove the `--new-env` flag and manually install the required dependencies. Refer to [PyTorch](https://pytorch.org/get-started/previous-versions/) for the installation command.
    - If you have multiple CUDA Toolkit versions installed, `PATH` should be set to the correct version before running the command. For example, if you have CUDA Toolkit 11.8 and 12.2 installed, you should run `export PATH=/usr/local/cuda-11.8/bin:$PATH` before running the command.
    - By default, the code uses the `flash-attn` backend for attention. For GPUs do not support `flash-attn` (e.g., NVIDIA V100), you can remove the `--flash-attn` flag to install `xformers` only and set the `ATTN_BACKEND` environment variable to `xformers` before running the code. See the [Minimal Example](#minimal-example) for more details.
    - The installation may take a while due to the large number of dependencies. Please be patient. If you encounter any issues, you can try to install the dependencies one by one, specifying one flag at a time.
    - If you encounter any issues during the installation, feel free to open an issue or contact us.
    
    Create a new conda environment named `trellis` and install the dependencies:
    ```sh
    . ./setup.sh --new-env --basic --xformers --flash-attn --diffoctreerast --spconv --mipgaussian --kaolin --nvdiffrast
    ```
    The detailed usage of `setup.sh` can be found by running `. ./setup.sh --help`.
    ```sh
    Usage: setup.sh [OPTIONS]
    Options:
        -h, --help              Display this help message
        --new-env               Create a new conda environment
        --basic                 Install basic dependencies
        --train                 Install training dependencies
        --xformers              Install xformers
        --flash-attn            Install flash-attn
        --diffoctreerast        Install diffoctreerast
        --spconv                Install spconv
        --mipgaussian           Install mip-splatting
        --kaolin                Install kaolin
        --nvdiffrast            Install nvdiffrast
        --demo                  Install all dependencies for demo
    ```

<!-- Pretrained Models -->
## 🤖 Pretrained Models

We provide the following pretrained models:

| Model | Description | #Params | Download |
| --- | --- | --- | --- |
| TRELLIS-image-large | Large image-to-3D model | 1.2B | [Download](https://huggingface.co/microsoft/TRELLIS-image-large) |
| TRELLIS-text-base | Base text-to-3D model | 342M | [Download](https://huggingface.co/microsoft/TRELLIS-text-base) |
| TRELLIS-text-large | Large text-to-3D model | 1.1B | [Download](https://huggingface.co/microsoft/TRELLIS-text-large) |
| TRELLIS-text-xlarge | Extra-large text-to-3D model | 2.0B | [Download](https://huggingface.co/microsoft/TRELLIS-text-xlarge) |

*Note: It is always recommended to use the image conditioned version of the models for better performance.*

*Note: All VAEs are included in **TRELLIS-image-large** model repo.*

The models are hosted on Hugging Face. You can directly load the models with their repository names in the code:
```python
TrellisImageTo3DPipeline.from_pretrained("microsoft/TRELLIS-image-large")
```

If you prefer loading the model from local, you can download the model files from the links above and load the model with the folder path (folder structure should be maintained):
```python
TrellisImageTo3DPipeline.from_pretrained("/path/to/TRELLIS-image-large")
```

<!-- Usage -->
## 💡 Usage

### Minimal Example

Here is an [example](example.py) of how to use the pretrained models for 3D asset generation.

```python
import os
# os.environ['ATTN_BACKEND'] = 'xformers'   # Can be 'flash-attn' or 'xformers', default is 'flash-attn'
os.environ['SPCONV_ALGO'] = 'native'        # Can be 'native' or 'auto', default is 'auto'.
                                            # 'auto' is faster but will do benchmarking at the beginning.
                                            # Recommended to set to 'native' if run only once.

import imageio
from PIL import Image
from trellis.pipelines import TrellisImageTo3DPipeline
from trellis.utils import render_utils, postprocessing_utils

# Load a pipeline from a model folder or a Hugging Face model hub.
pipeline = TrellisImageTo3DPipeline.from_pretrained("microsoft/TRELLIS-image-large")
pipeline.cuda()

# Load an image
image = Image.open("assets/example_image/T.png")

# Run the pipeline
outputs = pipeline.run(
    image,
    seed=1,
    # Optional parameters
    # sparse_structure_sampler_params={
    #     "steps": 12,
    #     "cfg_strength": 7.5,
    # },
    # slat_sampler_params={
    #     "steps": 12,
    #     "cfg_strength": 3,
    # },
)
# outputs is a dictionary containing generated 3D assets in different formats:
# - outputs['gaussian']: a list of 3D Gaussians
# - outputs['radiance_field']: a list of radiance fields
# - outputs['mesh']: a list of meshes

# Render the outputs
video = render_utils.render_video(outputs['gaussian'][0])['color']
imageio.mimsave("sample_gs.mp4", video, fps=30)
video = render_utils.render_video(outputs['radiance_field'][0])['color']
imageio.mimsave("sample_rf.mp4", video, fps=30)
video = render_utils.render_video(outputs['mesh'][0])['normal']
imageio.mimsave("sample_mesh.mp4", video, fps=30)

# GLB files can be extracted from the outputs
glb = postprocessing_utils.to_glb(
    outputs['gaussian'][0],
    outputs['mesh'][0],
    # Optional parameters
    simplify=0.95,          # Ratio of triangles to remove in the simplification process
    texture_size=1024,      # Size of the texture used for the GLB
)
glb.export("sample.glb")

# Save Gaussians as PLY files
outputs['gaussian'][0].save_ply("sample.ply")
```

After running the code, you will get the following files:
- `sample_gs.mp4`: a video showing the 3D Gaussian representation
- `sample_rf.mp4`: a video showing the Radiance Field representation
- `sample_mesh.mp4`: a video showing the mesh representation
- `sample.glb`: a GLB file containing the extracted textured mesh
- `sample.ply`: a PLY file containing the 3D Gaussian representation


### Web Demo

[app.py](app.py) provides a simple web demo for 3D asset generation. Since this demo is based on [Gradio](https://gradio.app/), additional dependencies are required:
```sh
. ./setup.sh --demo
```

After installing the dependencies, you can run the demo with the following command:
```sh
python app.py
```

Then, you can access the demo at the address shown in the terminal.


<!-- Dataset -->
## 📚 Dataset

We provide **TRELLIS-500K**, a large-scale dataset containing 500K 3D assets curated from [Objaverse(XL)](https://objaverse.allenai.org/), [ABO](https://amazon-berkeley-objects.s3.amazonaws.com/index.html), [3D-FUTURE](https://tianchi.aliyun.com/specials/promotion/alibaba-3d-future), [HSSD](https://huggingface.co/datasets/hssd/hssd-models), and [Toys4k](https://github.com/rehg-lab/lowshot-shapebias/tree/main/toys4k), filtered based on aesthetic scores. Please refer to the [dataset README](DATASET.md) for more details.


<!-- Training -->
## 🏋️‍♂️ Training

TRELLIS’s training framework is organized to provide a flexible and modular approach to building and fine-tuning large-scale 3D generation models. The training code is centered around `train.py` and is structured into several directories to clearly separate dataset handling, model components, training logic, and visualization utilities.

### Code Structure

- **train.py**: Main entry point for training.
- **trellis/datasets**: Dataset loading and preprocessing.
- **trellis/models**: Different models and their components.
- **trellis/modules**: Custom modules for various models.
- **trellis/pipelines**: Inference pipelines for different models.
- **trellis/renderers**: Renderers for different 3D representations.
- **trellis/representations**: Different 3D representations.
- **trellis/trainers**: Training logic for different models.
- **trellis/utils**: Utility functions for training and visualization.

### Training Setup

1. **Prepare the Environment:**
   - Ensure all training dependencies are installed.
   - Use a Linux system with an NVIDIA GPU (The models are trained on NVIDIA A100 GPUs).
   - For distributed training, verify that your nodes can communicate through the designated master address and port.

2. **Dataset Preparation:**
   - Organize your dataset similar to TRELLIS-500K. Specify your dataset path using the `--data_dir` argument when launching training.

3. **Configuration Files:**
   - Training hyperparameters and model architectures are defined in configuration files under the `configs/` directory.
   - Example configuration files include:

| Config | Pretained Model | Description |
| --- | --- | --- |
| [`vae/ss_vae_conv3d_16l8_fp16.json`](configs/vae/ss_vae_conv3d_16l8_fp16.json) | [Encoder](https://huggingface.co/microsoft/TRELLIS-image-large/blob/main/ckpts/ss_enc_conv3d_16l8_fp16.safetensors) [Decoder](https://huggingface.co/microsoft/TRELLIS-image-large/blob/main/ckpts/ss_dec_conv3d_16l8_fp16.safetensors) | Sparse structure VAE |
| [`vae/slat_vae_enc_dec_gs_swin8_B_64l8_fp16.json`](configs/vae/slat_vae_enc_dec_gs_swin8_B_64l8_fp16.json) | [Encoder](https://huggingface.co/microsoft/TRELLIS-image-large/blob/main/ckpts/slat_enc_swin8_B_64l8_fp16.safetensors) [Decoder](https://huggingface.co/microsoft/TRELLIS-image-large/blob/main/ckpts/slat_dec_gs_swin8_B_64l8gs32_fp16.safetensors) | SLat VAE with Gaussian Decoder |
| [`vae/slat_vae_dec_rf_swin8_B_64l8_fp16.json`](configs/vae/slat_vae_dec_rf_swin8_B_64l8_fp16.json) | [Decoder](https://huggingface.co/microsoft/TRELLIS-image-large/blob/main/ckpts/slat_dec_rf_swin8_B_64l8r16_fp16.safetensors) | SLat Radiance Field Decoder |
| [`vae/slat_vae_dec_mesh_swin8_B_64l8_fp16.json`](configs/vae/slat_vae_dec_mesh_swin8_B_64l8_fp16.json) | [Decoder](https://huggingface.co/microsoft/TRELLIS-image-large/blob/main/ckpts/slat_dec_mesh_swin8_B_64l8m256c_fp16.safetensors) | SLat Mesh Decoder |
| [`generation/ss_flow_img_dit_L_16l8_fp16.json`](configs/generation/ss_flow_img_dit_L_16l8_fp16.json) | [Denoiser](https://huggingface.co/microsoft/TRELLIS-image-large/blob/main/ckpts/ss_flow_img_dit_L_16l8_fp16.safetensors) | Image conditioned sparse structure Flow Model |
| [`generation/slat_flow_img_dit_L_64l8p2_fp16.json`](configs/generation/slat_flow_img_dit_L_64l8p2_fp16.json) | [Denoiser](https://huggingface.co/microsoft/TRELLIS-image-large/blob/main/ckpts/slat_flow_img_dit_L_64l8p2_fp16.safetensors) | Image conditioned SLat Flow Model |
| [`generation/ss_flow_txt_dit_B_16l8_fp16.json`](configs/generation/ss_flow_txt_dit_B_16l8_fp16.json) | [Denoiser](https://huggingface.co/microsoft/TRELLIS-text-base/blob/main/ckpts/ss_flow_txt_dit_B_16l8_fp16.safetensors) | Base text-conditioned sparse structure Flow Model |
| [`generation/slat_flow_txt_dit_B_64l8p2_fp16.json`](configs/generation/slat_flow_txt_dit_B_64l8p2_fp16.json) | [Denoiser](https://huggingface.co/microsoft/TRELLIS-text-base/blob/main/ckpts/slat_flow_txt_dit_B_64l8p2_fp16.safetensors) | Base text-conditioned SLat Flow Model |
| [`generation/ss_flow_txt_dit_L_16l8_fp16.json`](configs/generation/ss_flow_txt_dit_L_16l8_fp16.json) | [Denoiser](https://huggingface.co/microsoft/TRELLIS-text-large/blob/main/ckpts/ss_flow_txt_dit_L_16l8_fp16.safetensors) | Large text-conditioned sparse structure Flow Model |
| [`generation/slat_flow_txt_dit_L_64l8p2_fp16.json`](configs/generation/slat_flow_txt_dit_L_64l8p2_fp16.json) | [Denoiser](https://huggingface.co/microsoft/TRELLIS-text-large/blob/main/ckpts/slat_flow_txt_dit_L_64l8p2_fp16.safetensors) | Large text-conditioned SLat Flow Model |
| [`generation/ss_flow_txt_dit_XL_16l8_fp16.json`](configs/generation/ss_flow_txt_dit_XL_16l8_fp16.json) | [Denoiser](https://huggingface.co/microsoft/TRELLIS-text-xlarge/blob/main/ckpts/ss_flow_txt_dit_XL_16l8_fp16.safetensors) | Extra-large text-conditioned sparse structure Flow Model |
| [`generation/slat_flow_txt_dit_XL_64l8p2_fp16.json`](configs/generation/slat_flow_txt_dit_XL_64l8p2_fp16.json) | [Denoiser](https://huggingface.co/microsoft/TRELLIS-text-xlarge/blob/main/ckpts/slat_flow_txt_dit_XL_64l8p2_fp16.safetensors) | Extra-large text-conditioned SLat Flow Model |

### Command-Line Options

The training script can be run as follows:
```sh
usage: train.py [-h] --config CONFIG --output_dir OUTPUT_DIR [--load_dir LOAD_DIR] [--ckpt CKPT] [--data_dir DATA_DIR] [--auto_retry AUTO_RETRY] [--tryrun] [--profile] [--num_nodes NUM_NODES] [--node_rank NODE_RANK] [--num_gpus NUM_GPUS] [--master_addr MASTER_ADDR] [--master_port MASTER_PORT]

options:
  -h, --help                    show this help message and exit
  --config CONFIG               Experiment config file
  --output_dir OUTPUT_DIR       Output directory
  --load_dir LOAD_DIR           Load directory, default to output_dir
  --ckpt CKPT                   Checkpoint step to resume training, default to latest
  --data_dir DATA_DIR           Data directory
  --auto_retry AUTO_RETRY       Number of retries on error
  --tryrun                      Try run without training
  --profile                     Profile training
  --num_nodes NUM_NODES         Number of nodes
  --node_rank NODE_RANK         Node rank
  --num_gpus NUM_GPUS           Number of GPUs per node, default to all
  --master_addr MASTER_ADDR     Master address for distributed training
  --master_port MASTER_PORT     Port for distributed training
```

### Example Training Commands

#### Single-node Training

To train a image-to-3D stage 2 model with a single machine.
```sh
python train.py \
  --config configs/vae/slat_vae_dec_mesh_swin8_B_64l8_fp16.json \
  --output_dir outputs/slat_vae_dec_mesh_swin8_B_64l8_fp16_1node \
  --data_dir /path/to/your/dataset1,/path/to/your/dataset2 \
```
The script will automatically distribute the training across all available GPUs. Specify the number of GPUs with the `--num_gpus` flag if you want to limit the number of GPUs used.

#### Multi-node Training

To train a image-to-3D stage 2 model with multiple GPUs across nodes (e.g., 2 nodes):
```sh
python train.py \
  --config configs/generation/slat_flow_img_dit_L_64l8p2_fp16.json \
  --output_dir outputs/slat_flow_img_dit_L_64l8p2_fp16_2nodes \
  --data_dir /path/to/your/dataset1,/path/to/your/dataset2 \
  --num_nodes 2 \
  --node_rank 0 \
  --master_addr $MASTER_ADDR \

... [TRUNCATED] ...
```

### `SECURITY.md`
```
<!-- BEGIN MICROSOFT SECURITY.MD V0.0.9 BLOCK -->

## Security

Microsoft takes the security of our software products and services seriously, which includes all source code repositories managed through our GitHub organizations, which include [Microsoft](https://github.com/Microsoft), [Azure](https://github.com/Azure), [DotNet](https://github.com/dotnet), [AspNet](https://github.com/aspnet) and [Xamarin](https://github.com/xamarin).

If you believe you have found a security vulnerability in any Microsoft-owned repository that meets [Microsoft's definition of a security vulnerability](https://aka.ms/security.md/definition), please report it to us as described below.

## Reporting Security Issues

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them to the Microsoft Security Response Center (MSRC) at [https://msrc.microsoft.com/create-report](https://aka.ms/security.md/msrc/create-report).

If you prefer to submit without logging in, send email to [secure@microsoft.com](mailto:secure@microsoft.com).  If possible, encrypt your message with our PGP key; please download it from the [Microsoft Security Response Center PGP Key page](https://aka.ms/security.md/msrc/pgp).

You should receive a response within 24 hours. If for some reason you do not, please follow up via email to ensure we received your original message. Additional information can be found at [microsoft.com/msrc](https://www.microsoft.com/msrc). 

Please include the requested information listed below (as much as you can provide) to help us better understand the nature and scope of the possible issue:

  * Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
  * Full paths of source file(s) related to the manifestation of the issue
  * The location of the affected source code (tag/branch/commit or direct URL)
  * Any special configuration required to reproduce the issue
  * Step-by-step instructions to reproduce the issue
  * Proof-of-concept or exploit code (if possible)
  * Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

If you are reporting for a bug bounty, more complete reports can contribute to a higher bounty award. Please visit our [Microsoft Bug Bounty Program](https://aka.ms/security.md/msrc/bounty) page for more details about our active programs.

## Preferred Languages

We prefer all communications to be in English.

## Policy

Microsoft follows the principle of [Coordinated Vulnerability Disclosure](https://aka.ms/security.md/cvd).

<!-- END MICROSOFT SECURITY.MD BLOCK -->
```

### `SUPPORT.md`
```
# TODO: The maintainer of this repo has not yet edited this file

**REPO OWNER**: Do you want Customer Service & Support (CSS) support for this product/project?

- **No CSS support:** Fill out this template with information about how to file issues and get help.
- **Yes CSS support:** Fill out an intake form at [aka.ms/onboardsupport](https://aka.ms/onboardsupport). CSS will work with/help you to determine next steps.
- **Not sure?** Fill out an intake as though the answer were "Yes". CSS will help you decide.

*Then remove this first heading from this SUPPORT.MD file before publishing your repo.*

# Support

## How to file issues and get help  

This project uses GitHub Issues to track bugs and feature requests. Please search the existing 
issues before filing new issues to avoid duplicates.  For new issues, file your bug or 
feature request as a new Issue.

For help and questions about using this project, please **REPO MAINTAINER: INSERT INSTRUCTIONS HERE 
FOR HOW TO ENGAGE REPO OWNERS OR COMMUNITY FOR HELP. COULD BE A STACK OVERFLOW TAG OR OTHER
CHANNEL. WHERE WILL YOU HELP PEOPLE?**.

## Microsoft Support Policy  

Support for this **PROJECT or PRODUCT** is limited to the resources listed above.
```

### `train.py`
```
import os
import sys
import json
import glob
import argparse
from easydict import EasyDict as edict

import torch
import torch.multiprocessing as mp
import numpy as np
import random

from trellis import models, datasets, trainers
from trellis.utils.dist_utils import setup_dist


def find_ckpt(cfg):
    # Load checkpoint
    cfg['load_ckpt'] = None
    if cfg.load_dir != '':
        if cfg.ckpt == 'latest':
            files = glob.glob(os.path.join(cfg.load_dir, 'ckpts', 'misc_*.pt'))
            if len(files) != 0:
                cfg.load_ckpt = max([
                    int(os.path.basename(f).split('step')[-1].split('.')[0])
                    for f in files
                ])
        elif cfg.ckpt == 'none':
            cfg.load_ckpt = None
        else:
            cfg.load_ckpt = int(cfg.ckpt)
    return cfg


def setup_rng(rank):
    torch.manual_seed(rank)
    torch.cuda.manual_seed_all(rank)
    np.random.seed(rank)
    random.seed(rank)


def get_model_summary(model):
    model_summary = 'Parameters:\n'
    model_summary += '=' * 128 + '\n'
    model_summary += f'{"Name":<{72}}{"Shape":<{32}}{"Type":<{16}}{"Grad"}\n'
    num_params = 0
    num_trainable_params = 0
    for name, param in model.named_parameters():
        model_summary += f'{name:<{72}}{str(param.shape):<{32}}{str(param.dtype):<{16}}{param.requires_grad}\n'
        num_params += param.numel()
        if param.requires_grad:
            num_trainable_params += param.numel()
    model_summary += '\n'
    model_summary += f'Number of parameters: {num_params}\n'
    model_summary += f'Number of trainable parameters: {num_trainable_params}\n'
    return model_summary


def main(local_rank, cfg):
    # Set up distributed training
    rank = cfg.node_rank * cfg.num_gpus + local_rank
    world_size = cfg.num_nodes * cfg.num_gpus
    if world_size > 1:
        setup_dist(rank, local_rank, world_size, cfg.master_addr, cfg.master_port)

    # Seed rngs
    setup_rng(rank)

    # Load data
    dataset = getattr(datasets, cfg.dataset.name)(cfg.data_dir, **cfg.dataset.args)

    # Build model
    model_dict = {
        name: getattr(models, model.name)(**model.args).cuda()
        for name, model in cfg.models.items()
    }

    # Model summary
    if rank == 0:
        for name, backbone in model_dict.items():
            model_summary = get_model_summary(backbone)
            print(f'\n\nBackbone: {name}\n' + model_summary)
            with open(os.path.join(cfg.output_dir, f'{name}_model_summary.txt'), 'w') as fp:
                print(model_summary, file=fp)

    # Build trainer
    trainer = getattr(trainers, cfg.trainer.name)(model_dict, dataset, **cfg.trainer.args, output_dir=cfg.output_dir, load_dir=cfg.load_dir, step=cfg.load_ckpt)

    # Train
    if not cfg.tryrun:
        if cfg.profile:
            trainer.profile()
        else:
            trainer.run()


if __name__ == '__main__':
    # Arguments and config
    parser = argparse.ArgumentParser()
    ## config
    parser.add_argument('--config', type=str, required=True, help='Experiment config file')
    ## io and resume
    parser.add_argument('--output_dir', type=str, required=True, help='Output directory')
    parser.add_argument('--load_dir', type=str, default='', help='Load directory, default to output_dir')
    parser.add_argument('--ckpt', type=str, default='latest', help='Checkpoint step to resume training, default to latest')
    parser.add_argument('--data_dir', type=str, default='./data/', help='Data directory')
    parser.add_argument('--auto_retry', type=int, default=3, help='Number of retries on error')
    ## dubug
    parser.add_argument('--tryrun', action='store_true', help='Try run without training')
    parser.add_argument('--profile', action='store_true', help='Profile training')
    ## multi-node and multi-gpu
    parser.add_argument('--num_nodes', type=int, default=1, help='Number of nodes')
    parser.add_argument('--node_rank', type=int, default=0, help='Node rank')
    parser.add_argument('--num_gpus', type=int, default=-1, help='Number of GPUs per node, default to all')
    parser.add_argument('--master_addr', type=str, default='localhost', help='Master address for distributed training')
    parser.add_argument('--master_port', type=str, default='12345', help='Port for distributed training')
    opt = parser.parse_args()
    opt.load_dir = opt.load_dir if opt.load_dir != '' else opt.output_dir
    opt.num_gpus = torch.cuda.device_count() if opt.num_gpus == -1 else opt.num_gpus
    ## Load config
    config = json.load(open(opt.config, 'r'))
    ## Combine arguments and config
    cfg = edict()
    cfg.update(opt.__dict__)
    cfg.update(config)
    print('\n\nConfig:')
    print('=' * 80)
    print(json.dumps(cfg.__dict__, indent=4))

    # Prepare output directory
    if cfg.node_rank == 0:
        os.makedirs(cfg.output_dir, exist_ok=True)
        ## Save command and config
        with open(os.path.join(cfg.output_dir, 'command.txt'), 'w') as fp:
            print(' '.join(['python'] + sys.argv), file=fp)
        with open(os.path.join(cfg.output_dir, 'config.json'), 'w') as fp:
            json.dump(config, fp, indent=4)

    # Run
    if cfg.auto_retry == 0:
        cfg = find_ckpt(cfg)
        if cfg.num_gpus > 1:
            mp.spawn(main, args=(cfg,), nprocs=cfg.num_gpus, join=True)
        else:
            main(0, cfg)
    else:
        for rty in range(cfg.auto_retry):
            try:
                cfg = find_ckpt(cfg)
                if cfg.num_gpus > 1:
                    mp.spawn(main, args=(cfg,), nprocs=cfg.num_gpus, join=True)
                else:
                    main(0, cfg)
                break
            except Exception as e:
                print(f'Error: {e}')
                print(f'Retrying ({rty + 1}/{cfg.auto_retry})...')
            ```

### `configs\generation\slat_flow_img_dit_L_64l8p2_fp16.json`
```
{
    "models": {
        "denoiser": {
            "name": "ElasticSLatFlowModel",
            "args": {
                "resolution": 64,
                "in_channels": 8,
                "out_channels": 8,
                "model_channels": 1024,
                "cond_channels": 1024,
                "num_blocks": 24,
                "num_heads": 16,
                "mlp_ratio": 4,
                "patch_size": 2,
                "num_io_res_blocks": 2,
                "io_block_channels": [128],
                "pe_mode": "ape",
                "qk_rms_norm": true,
                "use_fp16": true
            }
        }
    },
    "dataset": {
        "name": "ImageConditionedSLat",
        "args": {
            "latent_model": "dinov2_vitl14_reg_slat_enc_swin8_B_64l8_fp16",
            "min_aesthetic_score": 4.5,
            "max_num_voxels": 32768,
            "image_size": 518,
            "normalization": {
                "mean": [
                    -2.1687545776367188,
                    -0.004347046371549368,
                    -0.13352349400520325,
                    -0.08418072760105133,
                    -0.5271206498146057,
                    0.7238689064979553,
                    -1.1414450407028198,
                    1.2039363384246826
                ],
                "std": [
                    2.377650737762451,
                    2.386378288269043,
                    2.124418020248413,
                    2.1748552322387695,
                    2.663944721221924,
                    2.371192216873169,
                    2.6217446327209473,
                    2.684523105621338
                ]
            },
            "pretrained_slat_dec": "microsoft/TRELLIS-image-large/ckpts/slat_dec_gs_swin8_B_64l8gs32_fp16"
        }
    },
    "trainer": {
        "name": "ImageConditionedSparseFlowMatchingCFGTrainer",
        "args": {
            "max_steps": 1000000,
            "batch_size_per_gpu": 8,
            "batch_split": 4,
            "optimizer": {
                "name": "AdamW",
                "args": {
                    "lr": 0.0001,
                    "weight_decay": 0.0
                }
            },
            "ema_rate": [
                0.9999
            ],
            "fp16_mode": "inflat_all",
            "fp16_scale_growth": 0.001,
            "elastic": {
                "name": "LinearMemoryController",
                "args": {
                    "target_ratio": 0.75,
                    "max_mem_ratio_start": 0.5
                }
            },
            "grad_clip": {
                "name": "AdaptiveGradClipper",
                "args": {
                    "max_norm": 1.0,
                    "clip_percentile": 95
                }
            },
            "i_log": 500,
            "i_sample": 10000,
            "i_save": 10000,
            "p_uncond": 0.1,
            "t_schedule": {
                "name": "logitNormal",
                "args": {
                    "mean": 1.0,
                    "std": 1.0
                }
            },
            "sigma_min": 1e-5,
            "image_cond_model": "dinov2_vitl14_reg"
        }
    }
}```

### `configs\generation\slat_flow_txt_dit_B_64l8p2_fp16.json`
```
{
    "models": {
        "denoiser": {
            "name": "ElasticSLatFlowModel",
            "args": {
                "resolution": 64,
                "in_channels": 8,
                "out_channels": 8,
                "model_channels": 768,
                "cond_channels": 768,
                "num_blocks": 12,
                "num_heads": 12,
                "mlp_ratio": 4,
                "patch_size": 2,
                "num_io_res_blocks": 2,
                "io_block_channels": [128],
                "pe_mode": "ape",
                "qk_rms_norm": true,
                "use_fp16": true
            }
        }
    },
    "dataset": {
        "name": "TextConditionedSLat",
        "args": {
            "latent_model": "dinov2_vitl14_reg_slat_enc_swin8_B_64l8_fp16",
            "min_aesthetic_score": 4.5,
            "max_num_voxels": 32768,
            "normalization": {
                "mean": [
                    -2.1687545776367188,
                    -0.004347046371549368,
                    -0.13352349400520325,
                    -0.08418072760105133,
                    -0.5271206498146057,
                    0.7238689064979553,
                    -1.1414450407028198,
                    1.2039363384246826
                ],
                "std": [
                    2.377650737762451,
                    2.386378288269043,
                    2.124418020248413,
                    2.1748552322387695,
                    2.663944721221924,
                    2.371192216873169,
                    2.6217446327209473,
                    2.684523105621338
                ]
            },
            "pretrained_slat_dec": "microsoft/TRELLIS-image-large/ckpts/slat_dec_gs_swin8_B_64l8gs32_fp16"
        }
    },
    "trainer": {
        "name": "TextConditionedSparseFlowMatchingCFGTrainer",
        "args": {
            "max_steps": 1000000,
            "batch_size_per_gpu": 16,
            "batch_split": 4,
            "optimizer": {
                "name": "AdamW",
                "args": {
                    "lr": 0.0001,
                    "weight_decay": 0.0
                }
            },
            "ema_rate": [
                0.9999
            ],
            "fp16_mode": "inflat_all",
            "fp16_scale_growth": 0.001,
            "elastic": {
                "name": "LinearMemoryController",
                "args": {
                    "target_ratio": 0.75,
                    "max_mem_ratio_start": 0.5
                }
            },
            "grad_clip": {
                "name": "AdaptiveGradClipper",
                "args": {
                    "max_norm": 1.0,
                    "clip_percentile": 95
                }
            },
            "i_log": 500,
            "i_sample": 10000,
            "i_save": 10000,
            "p_uncond": 0.1,
            "t_schedule": {
                "name": "logitNormal",
                "args": {
                    "mean": 1.0,
                    "std": 1.0
                }
            },
            "sigma_min": 1e-5,
            "text_cond_model": "openai/clip-vit-large-patch14"
        }
    }
}```

### `configs\generation\slat_flow_txt_dit_L_64l8p2_fp16.json`
```
{
    "models": {
        "denoiser": {
            "name": "ElasticSLatFlowModel",
            "args": {
                "resolution": 64,
                "in_channels": 8,
                "out_channels": 8,
                "model_channels": 1024,
                "cond_channels": 768,
                "num_blocks": 24,
                "num_heads": 16,
                "mlp_ratio": 4,
                "patch_size": 2,
                "num_io_res_blocks": 2,
                "io_block_channels": [128],
                "pe_mode": "ape",
                "qk_rms_norm": true,
                "use_fp16": true
            }
        }
    },
    "dataset": {
        "name": "TextConditionedSLat",
        "args": {
            "latent_model": "dinov2_vitl14_reg_slat_enc_swin8_B_64l8_fp16",
            "min_aesthetic_score": 4.5,
            "max_num_voxels": 32768,
            "normalization": {
                "mean": [
                    -2.1687545776367188,
                    -0.004347046371549368,
                    -0.13352349400520325,
                    -0.08418072760105133,
                    -0.5271206498146057,
                    0.7238689064979553,
                    -1.1414450407028198,
                    1.2039363384246826
                ],
                "std": [
                    2.377650737762451,
                    2.386378288269043,
                    2.124418020248413,
                    2.1748552322387695,
                    2.663944721221924,
                    2.371192216873169,
                    2.6217446327209473,
                    2.684523105621338
                ]
            },
            "pretrained_slat_dec": "microsoft/TRELLIS-image-large/ckpts/slat_dec_gs_swin8_B_64l8gs32_fp16"
        }
    },
    "trainer": {
        "name": "TextConditionedSparseFlowMatchingCFGTrainer",
        "args": {
            "max_steps": 1000000,
            "batch_size_per_gpu": 8,
            "batch_split": 4,
            "optimizer": {
                "name": "AdamW",
                "args": {
                    "lr": 0.0001,
                    "weight_decay": 0.0
                }
            },
            "ema_rate": [
                0.9999
            ],
            "fp16_mode": "inflat_all",
            "fp16_scale_growth": 0.001,
            "elastic": {
                "name": "LinearMemoryController",
                "args": {
                    "target_ratio": 0.75,
                    "max_mem_ratio_start": 0.5
                }
            },
            "grad_clip": {
                "name": "AdaptiveGradClipper",
                "args": {
                    "max_norm": 1.0,
                    "clip_percentile": 95
                }
            },
            "i_log": 500,
            "i_sample": 10000,
            "i_save": 10000,
            "p_uncond": 0.1,
            "t_schedule": {
                "name": "logitNormal",
                "args": {
                    "mean": 1.0,
                    "std": 1.0
                }
            },
            "sigma_min": 1e-5,
            "text_cond_model": "openai/clip-vit-large-patch14"
        }
    }
}```
