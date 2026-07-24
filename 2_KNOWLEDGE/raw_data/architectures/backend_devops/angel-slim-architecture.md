# Architecture Extract: AngelSlim

## Directory Structure
```text
AngelSlim/
    .gitignore
    .gitmodules
    .pre-commit-config.yaml
    .readthedocs.yaml
    LICENSE
    README.md
    README_cn.md
    setup.py
    .github/
        workflows/
            code-format.yml
            codeql.yml
            deploy.yml
    angelslim/
        engine.py
        __init__.py
        compressor/
            compressor_factory.py
            _platform.py
            __init__.py
            diffusion/
                README.md
                __init__.py
                cache/
                    cache_helper.py
                    deepcache_helper.py
                    taylorcache_helper.py
                    teacache_helper.py
                    __init__.py
                kernels/
                    __init__.py
                    python/
                        __init__.py
                        gemm/
                            fp8_gemm.py
                            fp8_gemm_torch.py
                            __init__.py
                        quantizers/
                            fp8_per_block.py
                            fp8_per_block_torch.py
                            fp8_per_token_group.py
                            fp8_per_token_group_torch.py
                            __init__.py
                quant/
                    ptq.py
                    quant_func.py
                    __init__.py
                    modules/
                        linear.py
                        __init__.py
                    utils/
                        quant_io.py
                        utils.py
                        __init__.py
            distill/
                distill.py
                loss.py
                trainer.py
                __init__.py
            qad/
                qad.py
                __init__.py
            qat/
                qat.py
                modules/
                    quantizer.py
                    scaler.py
                    special_quantizer.py
                    __init__.py
                plugins/
                    base_plugin.py
                    learnable_scale.py
                    plugin_manager.py
                    __init__.py
                trainers/
                    blockwise_trainer.py
                    end2end_trainer.py
                    trainer_factory.py
                    __init__.py
            quant/
                ptq.py
                __init__.py
                core/
                    config.py
                    fp8_analyse_tools.py
                    hook.py
                    kernels.py
                    metrics.py
                    packing_utils.py
                    quant_func.py
                    quant_func_torch.py
                    sample_func.py
                    save.py
                    weight_quantize.py
                    __init__.py
                    vllm_calibrate_utils/
                        hooks.py
                        search.py
                        _common.py
                        __init__.py
                modules/
                    catcher.py
                    helper_layer.py
                    __init__.py
                    awq/
                        auto_clip.py
                        auto_scale.py
                        awq.py
                        search.py
                        __init__.py
                    daq/
                        daq.py
                        scale_search.py
                        utils.py
                        __init__.py
                    fp8/
                        fp8.py
                        lepto_fp8.py
                        lepto_scale.py
                        __init__.py
                    gptq/
                        gptaq_module.py
                        gptq.py
                        gptq_module.py
                        __init__.py
                    int8/
                        int8.py
                        __init__.py
                    nvfp4/
                        nvfp4.py
                        __init__.py
                    smooth/
                        smooth.py
                        __init__.py
                    w4a8int8/
                        w4a8int8.py
                        __init__.py
                observers/
                    abs_max_activation.py
                    abs_max_weight.py
                    base_observer.py
                    ema_activation.py
                    groupwise_weight.py
                    hist_activation.py
                    observer.py
                    __init__.py
            sparsity/
                __init__.py
                stem/
                    patch.py
                    stem.py
                    stem_configuration.py
                    __init__.py
                    backends/
                        dispatcher.py
                        hpc_impl.py
                        torch_impl.py
                        __init__.py
                    modules/
                        forward.py
                        __init__.py
                    ops/
                        stem_kernel.py
                        __init__.py
                vecattention/
                    patch.py
                    vecattention.py
                    vecattention_configuration.py
                    __init__.py
                    modules/
                        forward.py
                        __init__.py
                    ops/
                        vecattention_kernel.py
                        __init__.py
                        cache/
                            dit_vecattention_kernels_best_eff_configs.pkl
                            vlm_vecattention_kernels_best_eff_configs.pkl
                        vllm-flash-attention/
            speculative/
                __init__.py
                benchmark/
                    __init__.py
                    pytorch/
                        benchmark_engine.py
                        generate_baseline_answer.py
                        generate_eagle_answer.py
                        __init__.py
                    vllm/
                        benchmark_engine.py
                        generate_baseline_answer.py
                        generate_eagle_answer.py
                        __init__.py
                inference/
                    __init__.py
                    models/
                        __init__.py
                        eagle3/
                            configuration_eagle3_model.py
                            eagle3_model.py
                            __init__.py
                            draft/
                                base_model.py
                                llama3_eagle3.py
                                __init__.py
                            target/
                                modeling_cosyvoice3_kv.py
                                modeling_llama_kv.py
                                modeling_qwen2_kv.py
                                modeling_qwen3_kv.py
                                __init__.py
                train/
                    __init__.py
                    configs/
                        cosyvoice3-llm-eagle3.json
                        deepspeed_zero2.json
                        deepspeed_zero3.json
                        hunyuan-1.8b-eagle3.json
                        hunyuan-4b-eagle3.json
                        hunyuan-7b-eagle3.json
                        hunyuan_ocr-eagle3.json
                        qwen2-audio-7b-eagle3.json
                        qwen2.5-0.5b-eagle3.json
                        qwen2.5-1.5b-eagle3.json
                        qwen2.5-3b-eagle3.json
                        qwen2.5-7b-eagle3.json
                        qwen2.5-vl-3b-eagle3-mrope.json
                        qwen2.5-vl-7b-eagle3-mrope.json
                        qwen3-0.6b-eagle3.json
                        qwen3-1.7b-eagle3.json
                        qwen3-14b-eagle3.json
                        qwen3-30b-a3b-eagle3.json
                        qwen3-32b-eagle3.json
                        qwen3-4b-eagle3.json
                        qwen3-8b-eagle3.json
                        qwen3-vl-2b-eagle3-mrope.json
                        qwen3-vl-30b-a3b-eagle3-mrope.json
                        qwen3-vl-4b-eagle3-mrope.json
                        qwen3-vl-4b-eagle3.json
                        qwen3-vl-8b-eagle3-mrope.json
                    data/
                        chat_templates.py
                        dataset.py
                        data_generation.py
                        data_utils.py
                        noise_transforms.py
                        __init__.py
                        dataset_builder/
                            base_dataset_builder.py
                            dataset_builder_factory.py
                            offline_dataset_builder.py
                            online_dataset_builder.py
                            __init__.py
                    models/
                        model_utils.py
                        __init__.py
                        draft/
                            base_model.py
                            draft_model_factory.py
                            llama_eagle3.py
                            qwen_dflare.py
                            qwen_dflash.py
                            __init__.py
                        target/
                            cosyvoice3_llm.py
                            target_head.py
                            target_model_wrapper.py
                            __init__.py
                    trainer/
                        eagle3_trainer.py
                        offline_dflash_trainer.py
                        offline_eagle3_trainer.py
                        online_dflash_trainer.py
                        online_eagle3_trainer.py
                        trainer_factory.py
                        __init__.py
                utils/
                    kv_cache.py
                    util.py
                    __init__.py
            token_compressor/
                adapter.py
                factory.py
                algorithm/
                    attention_based.py
                    basic.py
                    dart.py
                    divprune.py
                    hiprune.py
                    idpruner.py
                    scope.py
                    visionselector.py
                    visionzip.py
                    vispruner.py
                    utils/
                        merging_utils.py
                        utils.py
                        vision_selector_utils.py
                base/
                    cache.py
                    config.py
                    context.py
                models/
                    llava.py
                    qwen2_5_vl.py
                utils/
                    config_utils.py
                    eval_utils.py
                    mask_utils.py
            transform/
                base.py
                factory.py
                __init__.py
                rotation/
                    fuse_norm_utils.py
                    hadamard_utils.py
                    mapping.py
                    permutation.py
                    spin.py
                    __init__.py
                smooth/
                    config.py
                    __init__.py
                    convert/
                        apply_funcs.py
                        utils.py
                        __init__.py
                    core/
                        stats_search.py
                        tensor_math.py
                        __init__.py
                    vllm/
                        hooks.py
                        moe_inject.py
                        searcher_dist.py
                        __init__.py
        data/
            audio_dataset.py
            base_dataset.py
            dataloader.py
            multimodal_dataset.py
            omni_dataset.py
            qat_dataset.py
            text2image_dataset.py
            text_dataset.py
            __init__.py
        models/
            base_model.py
            model_factory.py
            __init__.py
            audio/
                qwen2_audio.py
                __init__.py
            diffusion/
                __init__.py
            llm/
                deepseek.py
                glm.py
                hunyuan_dense.py
                hunyuan_moe.py
                hunyuan_v3_moe.py
                kimi_k2.py
                llama.py
                modeling_deepseek.py
                qwen.py
                seed_oss.py
                tiktoken_tokenizer.py
                __init__.py
            omni/
                qwen3_omni.py
                __init__.py
            vlm/
                hunyuan_vl.py
                qwen3_5.py
                qwen3_vl.py
                qwen3_vl_moe.py
                qwen_vl.py
                __init__.py
        utils/
            config_parser.py
            default_compress_config.py
            lazy_imports.py
            utils.py
            zero3_io.py
            __init__.py
    configs/
        fsdp_config.json
        qwen3_dflare.json
        qwen3_dflash.json
        deepseek-coder/
            fp8_dynamic/
                deepseek-coder_fp8_dynamic.yaml
            fp8_static/
                deepseek-coder_fp8_static.yaml
        deepseek_r1/
            fp8_daq/
                deepseek_r1_daq_fp8_w8a8_block.yaml
                deepseek_r1_daq_fp8_w8a8_channel.yaml
            fp8_static/
                deepseek_r1_fp8_static.yaml
                deepseek_r1_fp8_static_low_memmory.yaml
            int4_awq/
                deepseek_r1_int4_awq.yaml
            w4a8_fp8/
                deepseek_r1_w4a8_fp8.yaml
                deepseek_r1_w4a8_fp8_low_memmory.yaml
                deepseek_r1_w4a8_fp8_vllm_calibrate.yaml
            w4a8_int8/
                deepseek_r1_w4a8_int8_kunlun.yaml
        deepseek_r1_distill_qwen/
            fp8_dynamic/
                deepseek_r1_distill_qwen-14b_fp8_dynamic.yaml
                deepseek_r1_distill_qwen-1_5b_fp8_dynamic.yaml
                deepseek_r1_distill_qwen-32b_fp8_dynamic.yaml
                deepseek_r1_distill_qwen-7b_fp8_dynamic.yaml
            fp8_static/
                deepseek_r1_distill_qwen-14b_fp8_static.yaml
                deepseek_r1_distill_qwen-1_5b_fp8_static.yaml
                deepseek_r1_distill_qwen-32b_fp8_static.yaml
                deepseek_r1_distill_qwen-7b_fp8_static.yaml
            int4_awq/
                deepseek_r1_distill_qwen-14b_int4_awq.yaml
                deepseek_r1_distill_qwen-1_5b_int4_awq.yaml
                deepseek_r1_distill_qwen-32b_int4_awq.yaml
                deepseek_r1_distill_qwen-7b_int4_awq.yaml
            int4_gptaq/
                deepseek_r1_distill_qwen-32b_int4_gptaq.yaml
            int4_gptq/
                deepseek_r1_distill_qwen-14b_int4_gptq.yaml
                deepseek_r1_distill_qwen-1_5b_int4_gptq.yaml
                deepseek_r1_distill_qwen-32b_int4_gptq.yaml
                deepseek_r1_distill_qwen-7b_int4_gptq.yaml
        glm4/
            fp8_dynamic/
                glm4_6-fp8_dynamic.yaml
            fp8_static/
                glm4_6-fp8_static.yaml
        hunyuan/
            fp8_dynamic/
                hunyuan_0_5b_dense_fp8_dynamic.yaml
                hunyuan_1_8b_dense_fp8_dynamic.yaml
                hunyuan_4b_dense_fp8_dynamic.yaml
                hunyuan_7b_dense_fp8_dynamic.yaml
                hunyuan_a13b_fp8_dynamic.yaml
            fp8_static/
                hunyuanv3_a20b_fp8_static_c8.yaml
                hunyuan_0_5b_dense_fp8_static.yaml
                hunyuan_1_8b_dense_fp8_static.yaml
                hunyuan_2b_dense_lepto_fp8_static.yaml
                hunyuan_4b_dense_fp8_static.yaml
                hunyuan_4b_dense_lepto_fp8_static.yaml
                hunyuan_7b_dense_fp8_static.yaml
                hunyuan_a13b_fp8_static.yaml
                hunyuan_a13b_fp8_static_low_memory.yaml
            int4_awq/
                hunyuan-a13b_int4_awq.yaml
                hunyuan_0_5b_dense_int4_awq.yaml
                hunyuan_1_8b_dense_int4_awq.yaml
                hunyuan_4b_dense_int4_awq.yaml
                hunyuan_7b_dense_int4_awq.yaml
            int4_gptaq/
                hunyuan_7b_dense_int4_gptaq.yaml
            int4_gptq/
                hunyuan_0_5b_dense_int4_gptq.yaml
                hunyuan_1_8b_dense_int4_gptq.yaml
                hunyuan_4b_dense_int4_gptq.yaml
                hunyuan_7b_dense_int4_gptq.yaml
                hunyuan_a13b_int4_gptq.yaml
            ptq/
                fp8_static/
                    hunyuanv3_a20b_fp8_static.yaml
            qad/
                special/
                    hunyuan_seq_2bit_qad_zero2.yaml
            qat/
                fp8_static/
                    learn_scale/
                        ds_config_zero3.json
                        hunyuanv3_a20b_fp8_static_end2end_learn_scale_zero3.yaml
        hunyuan_ocr/
            fp8_static/
                hunyuan_ocr_fp8_static.yaml
            int4_awq/
                hunyuan_ocr_int4_awq.yaml
            int4_gptq/
                hunyuan_ocr_int4_gptq.yaml
        Hy3/
            ptq/
                fp8/
                    Hy3_kvcache_calibrate.yaml
                    Hy3_smooth.yaml
                    Hy3_vllm_ptq_kv_per_head.yaml
                    Hy3_vllm_ptq_per_tensor.yaml
        kimi_k2/
            fp8_static/
                kimi_k2_fp8_static.yaml
                kimi_k2_fp8_static_low_memmory.yaml
            w4a8_fp8/
                kimi_k2_w4a8_fp8.yaml
                kimi_k2_w4a8_fp8_low_memmory.yaml
        llava/
            pruning/
                baseline_r0.75.yaml
                dart_r0.75.yaml
                divprune_r0.75.yaml
                fastv_r0.75.yaml
                hiprune_r0.75.yaml
                idpruner_r0.75.yaml
                random_r0.75.yaml
                scope_r0.75.yaml
                visionzip_r0.75.yaml
                vision_selector_r0.75.yaml
                vispruner_r0.75.yaml
        qwen2_5/
            fp8_dynamic/
                qwen2_5-0_5b_instruct_fp8_dynamic.yaml
                qwen2_5-14b_instruct_fp8_dynamic.yaml
                qwen2_5-1_5b_instruct_fp8_dynamic.yaml
                qwen2_5-32b_instruct_fp8_dynamic.yaml
                qwen2_5-3b_instruct_fp8_dynamic.yaml
                qwen2_5-72b_instruct_fp8_dynamic.yaml
                qwen2_5-7b_instruct_fp8_dynamic.yaml
            fp8_static/
                qwen2_5-0_5b_instruct_fp8_static.yaml
                qwen2_5-14b_instruct_fp8_static.yaml
                qwen2_5-1_5b_instruct_ados_fp8_static.yaml
                qwen2_5-1_5b_instruct_fp8_static.yaml
                qwen2_5-32b_instruct_fp8_static.yaml
                qwen2_5-3b_instruct_fp8_static.yaml
                qwen2_5-72b_instruct_fp8_static.yaml
                qwen2_5-7b_fp8_static_low_memory.yaml
                qwen2_5-7b_instruct_fp8_static.yaml
            int4_awq/
                qwen2_5-1_5b_int4_awq.yaml
                qwen2_5-32b_int4_awq.yaml
                qwen2_5-7b_int4_awq.yaml
            int4_gptaq/
                qwen2_5-32b_int4_gptaq.yaml
            int4_gptq/
                qwen2_5-1_5b_int4_gptq.yaml
                qwen2_5-32b_int4_gptq.yaml
                qwen2_5-7b_int4_gptq.yaml
        qwen2_5_vl/
            int8_dynamic/
                qwen2_5_vl-32b_int8_dynamic.yaml
                qwen2_5_vl-3b_int8_dynamic.yaml
                qwen2_5_vl-72b_int8_dynamic.yaml
                qwen2_5_vl-7b_int8_dynamic.yaml
            pruning/
                baseline_r0.75.yaml
                baseline_r0.9.yaml
                dart_r0.75.yaml
                dart_r0.9.yaml
                divprune_r0.75.yaml
                divprune_r0.9.yaml
                fastv_r0.75.yaml
                fastv_r0.9.yaml
                hiprune_r0.75.yaml
                hiprune_r0.9.yaml
                idpruner_r0.75.yaml
                idpruner_r0.9.yaml
                random_r0.75.yaml
                random_r0.9.yaml
                scope_r0.75.yaml
                scope_r0.9.yaml
                visionzip_r0.75.yaml
                visionzip_r0.9.yaml
                vision_selector_r0.75.yaml
                vision_selector_r0.9.yaml
                vispruner_r0.75.yaml
                vispruner_r0.9.yaml
            quantization/
                fp8_dynamic/
                    qwen2_5_vl-32b_fp8_dynamic.yaml
                    qwen2_5_vl-3b_fp8_dynamic.yaml
                    qwen2_5_vl-72b_fp8_dynamic.yaml
                    qwen2_5_vl-7b_fp8_dynamic.yaml
                fp8_static/
                    qwen2_5_vl-32b_fp8_static.yaml
                    qwen2_5_vl-3b_fp8_static.yaml
                    qwen2_5_vl-72b_fp8_static.yaml
                    qwen2_5_vl-7b_fp8_static.yaml
                int4_awq/
                    qwen2_5_vl-32b_int4_awq.yaml
                    qwen2_5_vl-3b_int4_awq.yaml
                    qwen2_5_vl-72b_int4_awq.yaml
                    qwen2_5_vl-72b_int4_awq_low_memory.yaml
                    qwen2_5_vl-7b_int4_awq.yaml
                int4_gptq/
                    qwen2_5_vl-32b_int4_gptq.yaml
                    qwen2_5_vl-3b_int4_gptq.yaml
                    qwen2_5_vl-72b_int4_gptq.yaml
                    qwen2_5_vl-7b_int4_gptq.yaml
        qwen2_audio/
            fp8_dynamic/
                qwen2_audio_7b_fp8_dynamic.yaml
            fp8_static/
                qwen2_audio_7b_fp8_static.yaml
            int8_dynamic/
                qwen2_audio_7b_int8_dynamic.yaml
            smooth_int8/
                qwen2_audio_7b_int8_dynamic_smooth.yaml
        qwen3/
            distill/
                fp/
                    ds_config_zero2.json
                    qwen3-1_7b_fp_distill_cakld_from_qwen3-4b_zero2.yaml
            ptq/
                fp8_dynamic/
                    qwen3-0_6b_fp8_dynamic.yaml
                    qwen3-14b_fp8_dynamic.yaml
                    qwen3-1_7b_fp8_dynamic.yaml
                    qwen3-32b_fp8_dynamic.yaml
                    qwen3-4b_fp8_dynamic.yaml
                    qwen3-8b_fp8_dynamic.yaml
                    qwen3-a22b_fp8_dynamic.yaml
                    qwen3-a3b_fp8_dynamic.yaml
                    qwen3_coder-a35b_fp8_dynamic.yaml
                    qwen3_coder-a35b_fp8_dynamic_low_memory.yaml
                fp8_static/
                    qwen3-0_6b_fp8_static.yaml
                    qwen3-0_6b_fp8_static_analyse.yaml
                    qwen3-0_6b_lepto_fp8_static.yaml
                    qwen3-14b_fp8_static.yaml
                    qwen3-1_7b_fp8_static.yaml
                    qwen3-32b_fp8_static.yaml
                    qwen3-4b_fp8_static.yaml
                    qwen3-4b_lepto_fp8_static.yaml
                    qwen3-8b_fp8_static.yaml
                    qwen3-8b_lepto_fp8_static.yaml
                    qwen3-a22b_fp8_static.yaml
                    qwen3-a22b_fp8_static_low_memroy.yaml
                    qwen3-a3b_fp8_static.yaml
                    qwen3_coder-a35b_fp8_static.yaml
                    qwen3_coder-a35b_fp8_static_low_memory.yaml
                int4_awq/
                    qwen3-0_6b_int4_awq.yaml
                    qwen3-14b_int4_awq.yaml
                    qwen3-1_7b_int4_awq.yaml
                    qwen3-1_7b_int4_awq_low_memory.yaml
                    qwen3-32b_int4_awq.yaml
                    qwen3-4b_int4_awq.yaml
                    qwen3-8b_int4_awq.yaml
                    qwen3-a22b_int4_awq.yaml
                    qwen3-a3b_int4_awq.yaml
                int4_gptaq/
                    qwen3-4b_int4_gptaq.yaml
                int4_gptq/
                    qwen3-0_6b_int4_gptq.yaml
                    qwen3-14b_int4_gptq.yaml
                    qwen3-1_7b_int4_gptq.yaml
                    qwen3-32b_int4_gptq.yaml
                    qwen3-4b_int4_gptq.yaml
                    qwen3-8b_int4_gptq.yaml
                    qwen3-a22b_int4_gptq.yaml
                    qwen3-a3b_int4_gptq.yaml
                int8_dynamic/
                    qwen3-0_6b_int8_dynamic.yaml
                    qwen3-14b_int8_dynamic.yaml
                    qwen3-1_7b_int8_dynamic.yaml
                    qwen3-32b_int8_dynamic.yaml
                    qwen3-4b_int8_dynamic.yaml
                    qwen3-8b_int8_dynamic.yaml
                    qwen3-a22b_int8_dynamic.yaml
                    qwen3-a3b_int8_dynamic.yaml
                nvfp4/
                    qwen3-0_6b_nvfp4.yaml
                    qwen3-14b_nvfp4.yaml
                    qwen3-1_7b_nvfp4.yaml
                    qwen3-32b_nvfp4.yaml
                    qwen3-4b_nvfp4.yaml
                    qwen3-8b_nvfp4.yaml
                    qwen3-a22b_nvfp4.yaml
                smooth_int8/
                    qwen3-0_6b_int8_dynamic_smooth.yaml
                    qwen3-14b_int8_dynamic_smooth.yaml
                    qwen3-1_7b_int8_dynamic_smooth.yaml
                    qwen3-32b_int8_dynamic_smooth.yaml
                    qwen3-4b_int8_dynamic_smooth.yaml
                    qwen3-8b_int8_dynamic_smooth.yaml
                spinquant/
                    qwen3-8b_spinquant_int4_awq.yaml
                    qwen3-a3b_spinquant_fp8_static.yaml
                    qwen3_spinquant_fp8_static.yaml
            qad/
                special/
                    qwen3-1_7b_absmean_qad_from_qwen3-4b_zero2.yaml
                    qwen3-1_7b_dlt_qad_from_qwen3-4b_zero2.yaml
                    qwen3-1_7b_lsq_qad_from_qwen3-4b_zero2.yaml
                    qwen3-1_7b_seq_qad_from_qwen3-4b_zero2.yaml
                    qwen3-1_7b_sherry_qad_from_qwen3-4b_zero2.yaml
                    qwen3-1_7b_twn_qad_from_qwen3-4b_zero2.yaml
                w4a8_fp8/
                    ds_config_zero2.json
                    qwen3-4b_w4a8_fp8_qad_zero2.yaml
            qat/
                fp8_static/
                    learn_scale/
                        ds_config_zero3.json
                        qwen3-30b-a3b_fp8_static_end2end_learn_scale_zero3.yaml
                        qwen3-4b_fp8_static_end2end_learn_scale_zero3.yaml
                int4_weight_only/
                    learn_scale/
                        qwen3-4b_int4_weight_only_blockwise_learn_scale.yaml
                        qwen3-4b_int4_weight_only_end2end_learn_scale.yaml
                w4a8_fp8/
                    learn_scale/
                        qwen3-4b_w4a8_fp8_end2end_learn_scale.yaml
                        qwen3-4b_w4a8_fp8_end2end_learn_scale_lwc.yaml
                        qwen3-4b_w4a8_fp8_end2end_learn_scale_lwc_qkv_fp8attn.yaml
                        qwen3-4b_w4a8_fp8_end2end_learn_scale_qkv_fp8attn.yaml
        qwen3_5/
            fp8_blockwise/
                qwen3_5-27b_fp8_blockwise.yaml
                qwen3_5-4b_fp8_blockwise.yaml
                qwen3_5-9b_fp8_blockwise.yaml
                qwen3_5-a10b_fp8_blockwise.yaml
                qwen3_5-a17b_fp8_blockwise.yaml
                qwen3_5-a3b_fp8_blockwise.yaml
            fp8_dynamic/
                qwen3_5-a3b_fp8_dynamic.yaml
            fp8_static/
                qwen3_5-a3b_fp8_static.yaml
        qwen3_omni/
            fp8_dynamic/
                qwen3_omni_fp8_dynamic.yaml
            fp8_static/
                qwen3_omni_fp8_static.yaml
        qwen3_vl/
            fp8_static/
                qwen3_vl-235b_a22b_fp8_static.yaml
                qwen3_vl-2b_fp8_static.yaml
                qwen3_vl-30b_a3b_fp8_static.yaml
                qwen3_vl-32b_fp8_static.yaml
                qwen3_vl-4b_fp8_static.yaml
                qwen3_vl-8b_fp8_static.yaml
            int8_dynamic/
                qwen3_vl-235b_a22b_int8_dynamic.yaml
                qwen3_vl-2b_int8_dynamic.yaml
                qwen3_vl-30b_a3b_int8_dynamic.yaml
                qwen3_vl-32b_int8_dynamic.yaml
                qwen3_vl-4b_int8_dynamic.yaml
                qwen3_vl-8b_int8_dynamic.yaml
        qwq/
            fp8_dynamic/
                qwq-32b_fp8_dynamic.yaml
            fp8_static/
                qwq-32b_fp8_static.yaml
            int4_awq/
                qwq-32b_int4_awq.yaml
            int4_gptq/
                qwq-32b_int4_gptq.yaml
        seed_oss/
            fp8_dynamic/
                seed_oss-36b_instruct_fp8_dynamic.yaml
            fp8_static/
                seed_oss-36b_instruct_fp8_static.yaml
    dataset/
        README.md
        alpaca/
            question.jsonl
        audio_fake_data/
            fake_data.json
            audios/
                1.wav
                2.wav
        gsm8k/
            question.jsonl
        humaneval/
            question.jsonl
        librispeech_test/
            librispeech_eval_10_test.jsonl
            audios/
                1255-90413-0010.flac
                1580-141083-0008.flac
                1995-1837-0019.flac
                2803-154328-0004.flac
                5694-64029-0007.flac
                61-70970-0032.flac
                6267-53049-0027.flac
                6345-93306-0021.flac
                700-122867-0027.flac
                8188-269288-0038.flac
        mt_bench/
            question.jsonl
        multimodal_fake_data/
            fake_data.json
            fake_data_openai_formate.json
            images/
        omni_fake_data/
            fake_data.json
            audios/
                0.wav
            images/
        qa/
            question.jsonl
        qwen3_4b_rollout_10k/
            .gitignore
            prepare_qwen3_rollout_data.py
            README.md
        sharegpt_gpt4/
            sharegpt_gpt4_256.jsonl
        sharegpt_gpt4_qwen/
            sharegpt_gpt4-qwen3_a22B_output.jsonl
        sum/
            question.jsonl
        text2image_data/
            text2image_example_data.jsonl
        tts_fake_data/
            question.jsonl
            train.jsonl
            train_regenerate.jsonl
            zero_shot_prompt.wav
    docs/
        make.bat
        Makefile
        README.md
        requirements.txt
        source/
            conf.py
            index.md
            assets/
                dflare/
                HYMT1.5/
                logos/
                speculative_decoding/
                spec_exit/
                stem/
            deployment/
                deploy.md
            design/
                architecture.md
                index.md
                prepare_config.md
                prepare_dataset.md
                update_algorithm.md
            features/
                diffusion/
                    cache.md
                    index.md
                    quantization.md
                distill/
                    index.md
                qad/
                    index.md
                quantization/
                    awq.md
                    daq.md
                    fp8.md
                    fp8_lepto.md
                    gptq.md
                    index.md
                    int8.md
                    qat.md
                    qat_zero3.md
                sparse_attention/
                    index.md
                    stem.md
                speculative_decoding/
                    dcut.md
                    dflare.md
                    index.md
                    spec_exit.md
                    eagle/
                        audio_asr_eagle.md
                        audio_tts_eagle.md
                        eagle.md
                        index.md
                        vlm_eagle.md
                token_compressor/
                    add_pruning_strategy.md
                    idpruner.md
                    index.md
                    installation.md
                    other_methods.md
                transform/
                    spinquant.md
            getting_started/
                installation.md
                quickstrat.md
            models/
                deepseek/
                    deepseek_quant.md
                hunyuan/
                    hunyuan_quant.md
                hunyuan_ocr/
                    hunyuan_ocr_quant.md
                Hy-MT1.5/
                    hy-mt1.5.md
                kimi_k2/
                    kimi_k2_quant.md
                qwen/
                    qwen_quant.md
                qwen3_omni/
                    qwen3_omni_quant.md
                qwenvl/
                    qwenvl_quant.md
            performance/
                quantization/
                    benchmarks.md
                speculative_decoding/
                    benchmarks.md
            _extra/
                dcut.html
    requirements/
        requirements.txt
        requirements_benchmark.txt
        requirements_diffusion.txt
        requirements_multimodal.txt
        requirements_speculative.txt
    scripts/
        deploy/
            lmms_eval.sh
            lm_eval.sh
            offline.py
            openai.sh
            run_sglang.sh
            run_vllm.sh
        diffusion/
            run_diffusion.py
            run_diffusion.sh
        distill/
            run_distill_for_qwen_1_7b_zero2.sh
        pruning/
            eval_qwen2_5_vl_visionzip_r0.9.sh
            test_qwen2_5_vl_visionzip_r0.9.sh
        ptq/
            README.md
            run_kvcache_calibrate_for_Hy3.sh
            run_smooth_calibrate_for_HY3.sh
            run_smooth_convert_for_HY3.sh
            run_smooth_for_HY3.sh
            run_vllm_calibrate_for_Hy3.sh
            run_vllm_quant_for_deepseek_v3.sh
            run_vllm_quant_for_Hy3.sh
        qad/
            run_qad_for_qwen_4b_zero2.sh
        qat/
            run_qat_for_hunyuanv3_a20b_zero3.sh
            run_qat_for_qwen_30b_a3b_zero3.sh
            run_qat_for_qwen_4b_zero3.sh
        sparsity/
            run_stem.sh
        speculative/
            generate_data_for_target_model.sh
            generate_dflash_data.sh
            generate_hidden_for_draft_model.sh
            generate_vlm_hidden_for_draft_model.sh
            run_dflare_offline.sh
            run_dflare_online.sh
            run_dflash_offline.sh
            run_dflash_online.sh
            run_vllm_server.sh
            train_eagle3_offline.sh
            train_eagle3_online.sh
            train_eagle3_tts_online.sh
            train_eagle3_vlm_offline.sh
            train_eagle3_vlm_online.sh
            hunyuan_ocr/
                generate_vlm_hidden_for_draft_model.sh
                train_eagle3_vlm_offline.sh
                train_eagle3_vlm_online.sh
            qwen2_audio/
                train_eagle3_audio_online.sh
            qwen3_vl/
                generate_vlm_hidden_for_draft_model.sh
                generate_vlm_hidden_for_draft_model_ray.sh
                train_eagle3_vlm_offline.sh
                train_eagle3_vlm_online.sh
    tests/
        test_config_parser.py
        test_dataloader.py
        test_token_pruning_ratio.py
    tools/
        convert_int4_awq_offline.py
        daq_analyze.py
        dflash_benchmark.py
        fp8_quant_analyse.py
        fp8_quant_blockwise.py
        fp8_quant_with_vllm_activation.py
        generate_data_for_target_model.py
        generate_dflash_data.py
        generate_hidden_for_draft_model.py
        infer.py
        int8_channel_quant.py
        ray_generate_hidden_for_draft_model.py
        run.py
        run_stem.py
        run_token_pruning_evaluation.py
        run_transform_offline.py
        run_vecattention.py
        run_vllm_calibrate.py
        spec_benchmark.py
        test_dataloader.py
        test_token_pruning.py
        train_dflash_offline.py
        train_dflash_online.py
        train_eagle3_offline.py
        train_eagle3_online.py
        vllm_offline_eagle3_qwen2_audio_bench.py
        vllm_offline_eagle3_vlm_batch.py
        vllm_spec_benchmark.py
        _yaml_args.py
        kvcache/
            README.md
            replace_kv_scales.py
            run_kvcache_calibrate.py
        smooth/
            convert_smooth_weights.py
            README.md
            run_vllm_smooth.py
        vllm_patch/
            envs.py
            fused_moe.py
            install.sh
            README.md
```

## Core Logic Samples

### `README.md`
```
English | [简体中文](README_cn.md)

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/source/assets/logos/angelslim_logo_light.png">
    <img alt="AngelSlim" src="./docs/source/assets/logos/angelslim_logo.png" width=55%>
  </picture>
</p>

<h3 align="center">
A more accessible, comprehensive, and efficient toolkit for large model compression.
</h3>

<p align="center">
          ✒️ <a href="https://arxiv.org/abs/2602.21233">TechnicalReport</a>&nbsp&nbsp | &nbsp&nbsp 📖 <a href="https://angelslim.readthedocs.io/">Documentation</a>&nbsp&nbsp | &nbsp&nbsp🤗 <a href="https://huggingface.co/AngelSlim">Hugging Face</a>&nbsp&nbsp | &nbsp&nbsp🤖 <a href="https://modelscope.cn/organization/AngelSlim">ModelScope</a>
<br>
</p>

<p align="center">
          💬 <a href="./docs/source/assets/angel_slim_wechat.png">WeChat</a> | &nbsp&nbsp🫨 <a href="https://discord.com/invite/dHVNeuNdFt">Discord</a>
<br>
</p>

## 📣Latest News
- [26/06/04] We have released **Stem**, a sparse attention algorithm that accelerates the **Prefill** stage of long-context LLMs by dynamically selecting top-k key blocks for block-sparse attention, significantly reducing latency while preserving generation quality. [[Docs]](https://angelslim.readthedocs.io/zh-cn/latest/features/sparse_attention/stem.html)
- [26/06/01] We have released **DFlare**, a block-diffusion speculative decoding framework with layer-wise fusion that achieves up to **5.52× end-to-end speedup**. [[Docs]](https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/dflare.html)
- [26/05/27] We have released **D-Cut**, an adaptive verification depth pruning technique for speculative decoding. [[Docs]](https://angelslim.readthedocs.io/zh-cn/latest/dcut.html)
- [26/05/20] We support Distillation for full-precision HuggingFace models and **quantized QAT-style** models, as detailed in the [distillation documentation](https://angelslim.readthedocs.io/zh-cn/latest/features/distill/index.html). 
- [26/05/08] We have released STQ1_0 kernel for 1.25-bit model and given a PR to llama.cpp [PR #22836](https://github.com/ggml-org/llama.cpp/pull/22836) ! If you have any questions or suggestions for STQ_0, welcome to comment under the PR !🔥🔥🔥
- [26/04/29] We have released 2-bit and 1.25-bit versions of Tencent Hy-MT1.5-1.8B Translation Model: [Hy-MT1.5-1.8B-2bit](https://huggingface.co/AngelSlim/Hy-MT1.5-1.8B-2bit) and [Hy-MT1.5-1.8B-1.25bit](https://huggingface.co/AngelSlim/Hy-MT1.5-1.8B-1.25bit). Additionally, we have make an [offline translation demo](https://huggingface.co/AngelSlim/Hy-MT1.5-1.8B-1.25bit/blob/main/Hy-MT-demo.apk) for you to try out. We invite you to give it a spin! 🔥🔥🔥
- [26/04/23] We now support FP8-Static quantization for **Hy3-preview** (MoE A20B).
- [26/03/25] We have released **DAQ**, the quantization algorithm that preserves the knowledge acquired while the update of parameters is relatively small during post-training training.[[Paper]](https://arxiv.org/abs/2603.22324) | [[Docs]](docs/source/features/quantization/daq.md)
- [26/02/09] We have released HY-1.8B-2Bit, 2bit on-device large language model,[[Huggingface]](https://huggingface.co/AngelSlim/HY-1.8B-2Bit).
- [26/01/13] We have released v0.3. We support the training and deployment of Eagle3 for all-scale LLMs/VLMs/Audio models, as detailed in the [guidance documentation](https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/index.html). And We released **Sherry**, the hardware-efficient 1.25 bit quantization algorithm [[Paper]](https://arxiv.org/abs/2601.07892) | [[Code]](https://github.com/Tencent/AngelSlim/tree/sherry/Sherry)🔥🔥🔥

<details>
<summary>Previous News</summary>

- [25/11/05] We have released v0.2. Quantization support for new models, such as `GLM-4.6`, `Qwen3-VL` and `Qwen3-Omni`, open-sources the Eagle3 speculative decoding training framework, and updates the Diffusion model quantization tools.
- [25/09/30] We have released **SpecExit**, the reasoning early-exit algorithm: [[Paper]](http://arxiv.org/abs/2509.24248) | [[Docs]](https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/spec_exit.html) | [[vLLM Code]](https://github.com/vllm-project/vllm/pull/27192)
- [25/09/26] We have released **TEQUILA**, the ternary quantization algorithm [[Paper]](https://arxiv.org/abs/2509.23809) | [[Code]](https://github.com/Tencent/AngelSlim/tree/tequila/TernaryQuant)
- [25/09/24] We now support the PTQ quantization of NVFP4 for the Qwen3 series models. We also opensource [Qwen3-32B-NVFP4](https://huggingface.co/AngelSlim/Qwen3-32B_nvfp4) and [Qwen3-235B-A22B-NVFP4](https://huggingface.co/AngelSlim/Qwen3-235B-A22B_nvfp4) weights.
- [25/09/01] We now support ​FP8 quantization​ of the [Hunyuan-MT-7B](https://huggingface.co/tencent/Hunyuan-MT-7B-fp8) translation model. And enabled ​Torch inference and Benchmark evaluation​ for Eagle3. And implemented support for ​quantization and Cache​ for [FLUX](https://github.com/Tencent/AngelSlim/tree/main/configs/flux). And support ​quantization​ for the [Seed-OSS](https://github.com/Tencent/AngelSlim/tree/main/configs/seed_oss).
- [25/08/06] We now support quantization for `Hunyuan 0.5B/1.8B/4B/7B` and multimodal model `Qwen2.5VL 3B/7B/32B/72B`, including `FP8/INT4` algorithms, and quantization for `DeepSeek-R1/V3` and `Kimi-K2`, including `FP8-Static` and `W4A8-FP8` algorithms. We also opensource `Hunyuan 1.8B/4B/7B` series Eagle3 model weight.
- [25/07/04] We now support quantization for `Hunyuan/Qwen2.5/Qwen3/DeepSeek-R1-Distill-Qwen` and other models, including `INT8/FP8/INT4` algorithms. We also opensource `Qwen3` series Eagle3 model weight.

</details>

## 🌟Key Features

- **Highly Integrated**: This toolkit integrates mainstream compression algorithms into a unified framework, offering developers one-click access with exceptional ease of use.
- **Continuous Innovation**: Beyond integrating widely-used industry algorithms, we are continuously researching better compression algorithms, which will be gradually open-sourced in the future.
- **Performance-Driven**: We continuously optimize end-to-end performance in model compression workflows and algorithm deployment, such as enabling quantization of models like Qwen3-235B and DeepSeek-R1 on a single GPU.

## 💼Technical Overview

<table>
  <thead>
    <tr>
      <th rowspan="2" style="text-align: center; vertical-align: middle;">Scenario</th>
      <th rowspan="2" style="text-align: center; vertical-align: middle;">Model</th>
      <th colspan="3" style="text-align: center; vertical-align: middle;">Compression Strategy</th>
    </tr>
    <tr>
      <th style="text-align: center; vertical-align: middle;">Quantization</th>
      <th style="text-align: center; vertical-align: middle;">Speculative Decoding</th>
      <th style="text-align: center; vertical-align: middle;">Other Techniques</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Large Language Models (LLMs)</strong></td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://huggingface.co/collections/tencent/hunyuan-dense-model">Hunyuan-Dense</a></li>
          <li><a href="https://huggingface.co/collections/tencent/hunyuan-a13b">Hunyuan-MoE</a></li>
          <li><a href="https://huggingface.co/collections/AngelSlim/qwen3-quant-68652e26da31740739d154f8">Qwen3</a></a></li>
          <li><a href="https://huggingface.co/AngelSlim/DeepSeek-R1-0528_w4a8_fp8">DeepSeek-V3/R1</a></li>
          <li><a href="https://huggingface.co/AngelSlim/Glm4_6-fp8_static">GLM-4.6</a></li>
          <li><a href="https://huggingface.co/collections/AngelSlim/qwen2-25-quant-68652d6cbdf5c0d4b1c4499a">Qwen2.5</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://github.com/Tencent/AngelSlim/tree/main/configs/qwen3">FP8-Static/Dynamic</a></li>
          <li><a href="https://github.com/Tencent/AngelSlim/tree/main/configs/qwen3">INT8-Dynamic</a></li>
          <li><a href="https://github.com/Tencent/AngelSlim/tree/main/configs/qwen3">INT4-GPTQ/AWQ/GPTAQ</a></li>
          <li><a href="https://github.com/Tencent/AngelSlim/tree/d55b06aeffc53e31f485044c5026e754f4e27b74/configs/qwen3/nvfp4">NVFP4</a></li>
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/quantization/fp8_lepto.html">LeptoQuant</a></li>
          <li><a href="https://github.com/Tencent/AngelSlim/tree/tequila/TernaryQuant">Tequila</a> | <a href="https://github.com/Tencent/AngelSlim/tree/sherry/Sherry">Sherry</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/index.html">Eagle3</a></li>
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/spec_exit.html">SpecExit</a></li>
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/dflare.html">DFlare</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li>
            <strong>Sparse Attention</strong>
            <ul style="padding-left: 1.5rem">
              <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/sparse_attention/stem.html">Stem</a></li>
            </ul>
          </li>
          <li>
            <strong>Distillation</strong>
            <ul style="padding-left: 1.5rem">
              <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/distill/index.html">Quantized Distillation</a></li>
            </ul>
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>Vision Language Models (VLMs)</strong></td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="">Hunyuan-VL</a></li>
          <li><a href="https://huggingface.co/tencent/HunyuanOCR">HunyuanOCR</a></li>
          <li><a href="https://huggingface.co/collections/Qwen/qwen3-vl">Qwen3-VL</a></li>
          <li><a href="https://huggingface.co/collections/Qwen/qwen25-vl">Qwen2.5-VL</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://github.com/Tencent/AngelSlim/tree/main/configs/qwen3_vl">FP8-Static/Dynamic</a></li>
          <li><a href="https://github.com/Tencent/AngelSlim/tree/main/configs/qwen2_5_vl">INT8-Dynamic</a></li>
          <li><a href="https://github.com/Tencent/AngelSlim/tree/main/configs/qwen2_5_vl">INT4-GPTQ/AWQ/GPTAQ</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/index.html">Eagle3</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li>
            <strong>Sparse Attention</strong>
            <ul style="padding-left: 1.5rem">
              <li><a href="https://github.com/anminliu/VecAttention">VecAttention</a></li>
            </ul>
          </li>
          <li>
            <strong>Token Pruning</strong>
            <ul style="padding-left: 1.5rem">
              <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/token_compressor/index.html">IDPruner</a></li>
            </ul>
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>Diffusion Models</strong></td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://huggingface.co/collections/tencent/hunyuanimage">Hunyuan-Image</a></li>
          <li><a href="https://huggingface.co/tencent/HunyuanVideo">Hunyuan-Video</a></li>
          <li><a href="https://huggingface.co/collections/tencent/hunyuan3d">Hunyuan-3D</a></li>
          <li><a href="https://huggingface.co/collections/Qwen/qwen-image">Qwen-Image</a></li>
          <li><a href="https://huggingface.co/collections/black-forest-labs/flux1">FLUX</a></li>
          <li><a href="https://huggingface.co/collections/Wan-AI/wan21">Wan</a></li>
          <li><a href="https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0">SDXL</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/diffusion/quantization.html">FP8-Dynamic</a></li>
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/diffusion/quantization.html">FP8-Weight-Only</a></li>
        </ul>
      </td>
      <td>-</td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li>
            <strong>Cache</strong>
            <ul style="padding-left: 1.5rem">
              <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/diffusion/cache.html">DeepCache</a></li>
              <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/diffusion/cache.html">TeaCache</a></li>
              <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/diffusion/cache.html">TaylorCache</a></li>
            </ul>
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>Speech Models​ (TTS/ASR)</strong></td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://huggingface.co/collections/Qwen/qwen3-omni">Qwen3-Omni</a></li>
          <li><a href="https://huggingface.co/collections/Qwen/qwen2-audio">Qwen2-Audio</a></li>
          <li><a href="https://huggingface.co/FunAudioLLM/Fun-CosyVoice3-0.5B-2512">Fun-CosyVoice3</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://github.com/Tencent/AngelSlim/blob/main/docs/source/models/qwen3_omni/qwen3_omni_quant.md">FP8-Static/Dynamic</a></li>
          <li><a href="https://github.com/Tencent/AngelSlim/tree/main/configs/qwen2_audio">INT8-Dynamic</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/index.html">Eagle3</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li>
            <strong>Token Pruning</strong>
            <ul style="padding-left: 1.5rem">
              <li>Under Development</li>
            </ul>
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## 🛎️How to Use

### 1. Install AngelSlim

We recommend using `pip` to install the latest stable version of `AngelSlim`:

```shell
pip install angelslim
```

Alternatively, you can clone the repository and install from source in editable mode:

```shell
cd AngelSlim && python setup.py install
```

For more detailed installation instructions and platform-specific guidance, please refer to the [Installation Documentation](https://angelslim.readthedocs.io/zh-cn/latest/getting_started/installation.html).



### 2. Quick Start

#### 2.1 Speculative Decoding

After installing AngelSlim, you can quickly start Eagle3 training with the following scripts:

```shell
# Start the vLLM server
bash scripts/speculative/run_vllm_server.sh
# Generate training data
bash scripts/speculative/generate_data_for_target_model.sh
# Perform online training for the Eagle3 model
bash scripts/speculative/train_eagle3_online.sh
```

Training and Deployment Guide for Eagle3: [LLM](https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/eagle.html) | [VLM](https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/vlm_eagle.html) | [Audio(ASR)](https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/audio_asr_eagle.html) | [Audio(TTS)](https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/audio_tts_eagle.html).

#### 2.2 LLM/VLM/Audio Model Quantization

After installing `AngelSlim`, you can launch static FP8 quantization for the Qwen3-1.7B model with the following one-command script:

```shell
python3 tools/run.py -c configs/qwen3/fp8_static/qwen3-1_7b_fp8_static.yaml
```

This example produces quantized model weights by performing PTQ calibration on a model loaded from HuggingFace.

For **Hy3-preview** (MoE A20B) FP8-Static quantization:

```shell
python tools/run.py -c configs/hunyuan/fp8_static/hunyuanv3_a20b_fp8_static_c8.yaml
```

<details>
<summary>Code-based Start</summary>

  To perform dynamic `FP8` quantization on `Qwen3-1.7B`:

  ```python
  from angelslim.engine import Engine

  slim_engine = Engine()
  # Prepare model
  slim_engine.prepare_model(model_name="Qwen", model_path="Qwen/Qwen3-1.7B",)
  # Initialize compressor
  slim_engine.prepare_compressor("PTQ", default_method="fp8_dynamic")
  # Compress model
  slim_engine.run()
  # Save compressed model
  slim_engine.save("./output")
  ```

</details>

For more details, please refer to the [Quick Start Documentation](https://angelslim.readthedocs.io/zh-cn/latest/getting_started/quickstrat.html).

#### 2.3 Diffusion Model Quantization


... [TRUNCATED] ...
```

### `README_cn.md`
```
简体中文 | [English](README.md)

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/source/assets/logos/angelslim_logo_light.png">
    <img alt="AngelSlim" src="./docs/source/assets/logos/angelslim_logo.png" width=55%>
  </picture>
</p>

<h3 align="center">
致力于打造更易用、更全面和更高效的大模型压缩工具包
</h3>

<p align="center">
          ✒️ <a href="https://arxiv.org/abs/2602.21233">TechnicalReport</a>&nbsp&nbsp | &nbsp&nbsp 📖 <a href="https://angelslim.readthedocs.io/">Documentation</a>&nbsp&nbsp | &nbsp&nbsp🤗 <a href="https://huggingface.co/AngelSlim">Hugging Face</a>&nbsp&nbsp | &nbsp&nbsp🤖 <a href="https://modelscope.cn/organization/AngelSlim">ModelScope</a>
<br>
</p>

<p align="center">
          💬 <a href="./docs/source/assets/angel_slim_wechat.png">WeChat</a> | &nbsp&nbsp🫨 <a href="https://discord.com/invite/dHVNeuNdFt">Discord</a>
<br>
</p>

## 📣最新进展
- [26/06/04] 我们发布了 **Stem**，一种稀疏注意力算法，通过在 block 粒度动态选择 top-k 关键块执行 block-sparse attention，加速长上下文 LLM 的 **Prefill** 阶段，在大幅降低延迟的同时实现几乎无损的生成质量。[[文档]](https://angelslim.readthedocs.io/zh-cn/latest/features/sparse_attention/stem.html)
- [26/06/01] 我们发布了 **DFlare**，一种基于 layer-wise fusion 的块扩散投机解码框架，端到端加速比可达 **5.52×**。[[文档]](https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/dflare.html)
- [26/05/27] 我们发布了 **D-Cut**，一种用于投机解码的自适应验证深度裁剪技术。[[文档]](https://angelslim.readthedocs.io/zh-cn/latest/dcut.html)
- [26/05/20]  我们支持了模型蒸馏功能，适用于huggingface 全精度或者**QAT量化**模型，详细步骤可以参考[文档](https://angelslim.readthedocs.io/zh-cn/latest/features/distill/index.html).🔥🔥🔥
- [26/05/08] 我们发布了用于 1.25-bit 模型的 STQ1_0 内核，并向 llama.cpp 提交了 [PR #22836](https://github.com/ggml-org/llama.cpp/pull/22836)！如果您对 STQ_0 有任何疑问或建议，欢迎在该 PR 下留言！🔥🔥🔥
- [26/04/29] 我们发布了 2bit 与 1.25bit 腾讯混元翻译模型 [Hy-MT1.5-1.8B-2bit](https://huggingface.co/AngelSlim/Hy-MT1.5-1.8B-2bit), [Hy-MT1.5-1.8B-1.25bit](https://huggingface.co/AngelSlim/Hy-MT1.5-1.8B-1.25bit)。并且还制作了 [离线翻译体验 Demo](https://huggingface.co/AngelSlim/Hy-MT1.5-1.8B-1.25bit/blob/main/Hy-MT-demo.apk)。 欢迎体验 🔥🔥🔥
- [26/04/23] 我们支持了 **Hy3-preview**（MoE A20B）模型的 FP8-Static 量化。
- [26/03/25] 我们发布了量化算法DAQ，该方法在后训练参数更新较小时，可保留量化后模型能力 [[论文]](https://arxiv.org/abs/2603.22324) | [[文档]](docs/source/features/quantization/daq.md)
- [26/02/09] 我们发布了 HY-1.8B-2Bit, 2比特端侧大模型, 模型可见[[Huggingface]](https://huggingface.co/AngelSlim/HY-1.8B-2Bit).
- [26/01/13] 我们发布V0.3版本， 支持了全模态场景的投机采样训练及部署，文档：[Eagle3 for LLM/VLM/Audio](https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/index.html)。并且我们发布了 **Sherry** 新的硬件高效的1.25bit三值量化算法 [[论文]](https://arxiv.org/abs/2601.07892) | [[代码]](https://github.com/Tencent/AngelSlim/tree/sherry/Sherry)🔥🔥🔥

<details>
<summary>历史更新</summary>

- [25/11/05] 我们发布V0.2版本，支持了包括GLM-4.6/Qwen3-VL/Qwen3-Omni等更多模型的量化，开源投机采样Eagle3训练框架，更新Diffusion模型量化工具。
- [25/09/30] 我们开源了思考早退新算法 **SpecExit** [[论文]](http://arxiv.org/abs/2509.24248) | [[文档]](https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/spec_exit.html) | [[vLLM代码]](https://github.com/vllm-project/vllm/pull/27192)
- [25/09/30] 我们发布了三值量化新算法 **Tequila** [[论文]](https://arxiv.org/abs/2509.23809) | [[代码]](https://github.com/Tencent/AngelSlim/tree/tequila/TernaryQuant)
- [25/09/24] 我们支持了Qwen3系列模型的NVFP4的PTQ量化，我们还开源了[Qwen3-32B-NVFP4](https://huggingface.co/AngelSlim/Qwen3-32B_nvfp4)、[Qwen3-235B-A22B-NVFP4](https://huggingface.co/AngelSlim/Qwen3-235B-A22B_nvfp4)权重。
- [25/09/01] 我们支持了[Hunyuan-MT-7B](https://huggingface.co/tencent/Hunyuan-MT-7B-fp8)翻译开源模型的FP8量化；支持了Eagle3的Torch推理及Benchmark评测流程。
- [25/08/06] 我们支持了`Hunyuan 0.5B/1.8B/4B/7B`和`Qwen2.5VL 3B/7B/32B/72B`的FP8、INT4量化，支持了`DeepSeek-R1/V3`和`Kimi-K2`模型的`W4A8-FP8`量化。我们还开源了`Hunyuan 1.8B/4B/7B`系列模型的Eagle3权重。
- [25/07/04] 我们支持了`Hunyuan/Qwen2.5/Qwen3/DeepSeek-R1-Distill-Qwen`等模型的量化，包含INT8、FP8、INT4等算法。
我们还开源了`Qwen3`系列模型的Eagle3权重。

</details>

## 🌟主要特性

- **高度集成化**：本工具将主流的压缩算法集成到工具，开发者可一键式调用，具有很好的易用性。
- **持续算法创新**：本工具除了集成工业界使用最广的算法，还持续自研更好的压缩算法，并且会陆续开源。
- **追求极致性能**：在模型压缩流程、压缩算法部署方面，本工具持续端到端优化，例如单卡GPU可量化Qwen3-235B和Deepseek-R1。

## 💼技术概览

<table>
  <thead>
    <tr>
      <th rowspan="2" style="text-align: center; vertical-align: middle;">场景</th>
      <th rowspan="2" style="text-align: center; vertical-align: middle;">模型</th>
      <th colspan="3" style="text-align: center; vertical-align: middle;">压缩策略</th>
    </tr>
    <tr>
      <th style="text-align: center; vertical-align: middle;">量化</th>
      <th style="text-align: center; vertical-align: middle;">投机采样</th>
      <th style="text-align: center; vertical-align: middle;">其他技术</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>文生文(LLM)</strong></td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://huggingface.co/collections/tencent/hunyuan-dense-model">Hunyuan-Dense</a></li>
          <li><a href="https://huggingface.co/collections/tencent/hunyuan-a13b">Hunyuan-MoE</a></li>
          <li><a href="https://huggingface.co/collections/AngelSlim/qwen3-quant-68652e26da31740739d154f8">Qwen3</a></a></li>
          <li><a href="https://huggingface.co/AngelSlim/DeepSeek-R1-0528_w4a8_fp8">DeepSeek-V3/R1</a></li>
          <li><a href="https://huggingface.co/AngelSlim/Glm4_6-fp8_static">GLM-4.6</a></li>
          <li><a href="https://huggingface.co/collections/AngelSlim/qwen2-25-quant-68652d6cbdf5c0d4b1c4499a">Qwen2.5</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://github.com/Tencent/AngelSlim/tree/main/configs/qwen3">FP8-Static/Dynamic</a></li>
          <li><a href="https://github.com/Tencent/AngelSlim/tree/main/configs/qwen3">INT8-Dynamic</a></li>
          <li><a href="https://github.com/Tencent/AngelSlim/tree/main/configs/qwen3">INT4-GPTQ/AWQ/GPTAQ</a></li>
          <li><a href="https://github.com/Tencent/AngelSlim/tree/d55b06aeffc53e31f485044c5026e754f4e27b74/configs/qwen3/nvfp4">NVFP4</a></li>
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/quantization/fp8_lepto.html">LeptoQuant</a></li>
          <li><a href="https://github.com/Tencent/AngelSlim/tree/tequila/TernaryQuant">Tequila</a> | <a href="https://github.com/Tencent/AngelSlim/tree/sherry/Sherry">Sherry</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/index.html">Eagle3</a></li>
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/spec_exit.html">SpecExit</a></li>
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/dflare.html">DFlare</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li>
            <strong>稀疏注意力</strong>
            <ul style="padding-left: 1.5rem">
              <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/sparse_attention/stem.html">Stem</a></li>
            </ul>
          </li>
          <li>
            <strong>蒸馏</strong>
            <ul style="padding-left: 1.5rem">
              <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/distill/index.html">量化蒸馏</a></li>
            </ul>
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>图/视频生文(VLM)</strong></td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="">Hunyuan-VL</a></li>
          <li><a href="https://huggingface.co/tencent/HunyuanOCR">HunyuanOCR</a></li>
          <li><a href="https://huggingface.co/collections/Qwen/qwen3-vl">Qwen3-VL</a></li>
          <li><a href="https://huggingface.co/collections/Qwen/qwen25-vl">Qwen2.5-VL</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://github.com/Tencent/AngelSlim/tree/main/configs/qwen3_vl">FP8-Static/Dynamic</a></li>
          <li><a href="https://github.com/Tencent/AngelSlim/tree/main/configs/qwen2_5_vl">INT8-Dynamic</a></li>
          <li><a href="https://github.com/Tencent/AngelSlim/tree/main/configs/qwen2_5_vl">INT4-GPTQ/AWQ/GPTAQ</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/index.html">Eagle3</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li>
            <strong>稀疏注意力</strong>
            <ul style="padding-left: 1.5rem">
              <li><a href="https://github.com/anminliu/VecAttention">VecAttention</a></li>
            </ul>
          </li>
          <li>
            <strong>Token剪枝</strong>
            <ul style="padding-left: 1.5rem">
              <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/token_compressor/index.html">IDPruner</a></li>
            </ul>
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>文生图/视频/3D(Diffusion)</strong></td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://huggingface.co/collections/tencent/hunyuanimage">Hunyuan-Image</a></li>
          <li><a href="https://huggingface.co/tencent/HunyuanVideo">Hunyuan-Video</a></li>
          <li><a href="https://huggingface.co/collections/tencent/hunyuan3d">Hunyuan-3D</a></li>
          <li><a href="https://huggingface.co/collections/Qwen/qwen-image">Qwen-Image</a></li>
          <li><a href="https://huggingface.co/collections/black-forest-labs/flux1">FLUX</a></li>
          <li><a href="https://huggingface.co/collections/Wan-AI/wan21">Wan</a></li>
          <li><a href="https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0">SDXL</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/diffusion/quantization.html">FP8-Dynamic</a></li>
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/diffusion/quantization.html">FP8-Weight-Only</a></li>
        </ul>
      </td>
      <td>-</td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li>
            <strong>Cache技术</strong>
            <ul style="padding-left: 1.5rem">
              <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/diffusion/cache.html">DeepCache</a></li>
              <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/diffusion/cache.html">TeaCache</a></li>
              <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/diffusion/cache.html">TaylorCache</a></li>
            </ul>
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><strong>语音(TTS/ASR)</strong></td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://huggingface.co/collections/Qwen/qwen3-omni">Qwen3-Omni</a></li>
          <li><a href="https://huggingface.co/collections/Qwen/qwen2-audio">Qwen2-Audio</a></li>
          <li><a href="https://huggingface.co/FunAudioLLM/Fun-CosyVoice3-0.5B-2512">Fun-CosyVoice3</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://github.com/Tencent/AngelSlim/blob/main/docs/source/models/qwen3_omni/qwen3_omni_quant.md">FP8-Static/Dynamic</a></li>
          <li><a href="https://github.com/Tencent/AngelSlim/tree/main/configs/qwen2_audio">INT8-Dynamic</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li><a href="https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/index.html">Eagle3</a></li>
        </ul>
      </td>
      <td>
        <ul style="padding-left: 0; list-style-position: inside;">
          <li>
            <strong>Token剪枝</strong>
            <ul style="padding-left: 1.5rem">
              <li>建设中</li>
            </ul>
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>


## 🛎️如何使用

### 1、安装 AngelSlim

推荐使用`pip`直接安装最新稳定版`AngelSlim`：

```shell
pip install angelslim
```

也可以选择克隆代码仓库后，以可编辑的方式从源代码安装：

```shell
cd AngelSlim && python setup.py install
```

更详细的安装说明以及不同平台的安装指引，可参考[安装文档](https://angelslim.readthedocs.io/zh-cn/latest/getting_started/installation.html)。

### 2、快速开始

#### 2.1 投机采样
完成安装`AngelSlim`后，您可以通过以下脚本快速开始`Eagle3`训练：

```shell
# 启动vLLM server
bash scripts/speculative/run_vllm_server.sh
# 生成训练数据
bash scripts/speculative/generate_data_for_target_model.sh
# 进行Eagle3模型的在线训练
bash scripts/speculative/train_eagle3_online.sh
```

全模态大模型的 Eagle3 训练与部署指南可参考：[LLM](https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/eagle.html) | [VLM](https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/vlm_eagle.html) | [Audio(ASR)](https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/audio_asr_eagle.html) | [Audio(TTS)](https://angelslim.readthedocs.io/zh-cn/latest/features/speculative_decoding/eagle/audio_tts_eagle.html).
#### 2.2 LLM/VLM模型量化
完成安装`AngelSlim`后，您可以通过以下脚本快速开始，完成`Qwen3-1.7B`模型的静态`FP8`量化：

1、一键式启动

  ```shell
  python3 tools/run.py -c configs/qwen3/fp8_static/qwen3-1_7b_fp8_static.yaml
  ```

  该示例将会加载`HugggingFace`模型进行PTQ量化校准，最终量化产出模型权重.

对 **Hy3-preview**（MoE A20B）进行 FP8-Static 量化：

  ```shell
  python tools/run.py -c configs/hunyuan/fp8_static/hunyuanv3_a20b_fp8_static_c8.yaml
  ```

<details>
<summary>2、源码启动</summary>

  例如对`Qwen3-1.7B`完成动态`FP8`量化：

  ```python
  from angelslim.engine import Engine

  slim_engine = Engine()
  # Prepare model
  slim_engine.prepare_model(model_name="Qwen", model_path="Qwen/Qwen3-1.7B")
  # Initialize compressor
  slim_engine.prepare_compressor("PTQ", default_method="fp8_dynamic")
  # Compress model
  slim_engine.run()
  # Save compressed model
  slim_engine.save("./output")
  ```

</details>

详情请参考量化[快速开始文档](https://angelslim.readthedocs.io/zh-cn/latest/getting_started/quickstrat.html)。

#### 2.3 Diffusion模型量化

使用 `scripts/diffusion/run_diffusion.py` 脚本进行量化与推理：

... [TRUNCATED] ...
```

### `setup.py`
```
# Copyright 2025 Tencent Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Setup for pip package."""
import subprocess

from setuptools import find_packages, setup

BASE_VERSION = None

if "main" in subprocess.getoutput("git branch"):
    BASE_VERSION = "0.0.0_dev"
else:
    tag_list = subprocess.getoutput("git tag").split("\n")
    BASE_VERSION = tag_list[-1]


def get_version_with_cuda_torch():
    """Generate version string with CUDA and PyTorch version suffix.

    Example: 0.0.0_dev+cu128.torch2.10
    """
    try:
        import torch

        # Get CUDA version (e.g., "12.8" -> "128")
        cuda_version = torch.version.cuda
        if cuda_version:
            cuda_version = cuda_version.replace(".", "")
        else:
            cuda_version = "cpu"

        # Get PyTorch version (e.g., "2.10.0" -> "2.10")
        torch_version = torch.__version__.split("+")[0]  # Remove any existing suffix
        torch_major_minor = ".".join(torch_version.split(".")[:2])

        return f"{BASE_VERSION}+cu{cuda_version}.torch{torch_major_minor}"
    except ImportError:
        # torch not installed, return base version
        return BASE_VERSION


TOOLS_VERSION = get_version_with_cuda_torch()


def get_requirements(filename):
    """Load dependency packages from specified requirements file"""
    with open(filename) as f:
        return [
            line.strip()
            for line in f.readlines()
            if line.strip() and not line.startswith(("#", "-"))
        ]


setup(
    name="angelslim",
    version=TOOLS_VERSION,
    description=("A toolkit for compress llm model."),
    long_description="Tools for llm model compression",
    url="https://github.com/Tencent/AngelSlim",
    author="Tencent Author",
    # Core dependencies: installed by default
    install_requires=get_requirements("requirements/requirements.txt"),
    # Define optional dependency groups
    extras_require={
        # Install all optional features: pip install angelslim[all]
        "all": (
            get_requirements("requirements/requirements_speculative.txt")
            + get_requirements("requirements/requirements_diffusion.txt")
            + get_requirements("requirements/requirements_multimodal.txt")
            + get_requirements("requirements/requirements_benchmark.txt")
        ),
        # Install speculative sampling functionality: pip install angelslim[speculative]
        "speculative": get_requirements("requirements/requirements_speculative.txt"),
        # Install Diffusion functionality: pip install angelslim[diffusion]
        "diffusion": get_requirements("requirements/requirements_diffusion.txt"),
        # Install multimodal functionality: pip install angelslim[multimodal]
        "multimodal": get_requirements("requirements/requirements_multimodal.txt"),
        # Install benchmark functionality: pip install angelslim[benchmark]
        "benchmark": get_requirements("requirements/requirements_benchmark.txt"),
    },
    packages=find_packages(),
    python_requires=">=3.0",
    # PyPI package information.
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Intended Audience :: Education",
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: Apache Software License",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.12",
        "Topic :: Scientific/Engineering",
        "Topic :: Scientific/Engineering :: Mathematics",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Software Development",
        "Topic :: Software Development :: Libraries",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
    license="License for AngelSlim",
    keywords=("Tencent large language model model-optimize compression toolkit."),
)
```

### `angelslim\engine.py`
```
# Copyright 2025 Tencent Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import json
import os
import sys
from dataclasses import asdict, dataclass
from typing import Any, Dict, Optional

import torch
from tqdm import tqdm

from .compressor import CompressorFactory
from .compressor.speculative.benchmark import pytorch as pytorch_benchmark
from .compressor.speculative.benchmark import vllm as vllm_benchmark
from .data.dataloader import DataLoaderFactory
from .models import SlimModelFactory
from .utils import (
    default_compress_config,
    get_loaders,
    get_package_info,
    parse_json_full_config,
    print_info,
)

DEFAULT_COMPRESSION_CONFIG = {
    "fp8_static": default_compress_config.default_fp8_static_config(),
    "fp8_dynamic": default_compress_config.default_fp8_dynamic_config(),
    "int8_dynamic": default_compress_config.default_int8_dynamic_config(),
    "int4_awq": default_compress_config.default_int4_awq_config(),
    "int4_gptq": default_compress_config.default_int4_gptq_config(),
    "w4a8_fp8": default_compress_config.default_w4a8_fp8_static_config(),
}


def get_supported_compress_method():
    return DEFAULT_COMPRESSION_CONFIG.keys()


class Engine:
    def __init__(self):
        """
        Initialize engine configuration
        """
        self.slim_model = None
        self.tokenizer = None
        self.dataloader = None
        self.compressor = None
        self.compress_type = None
        self.only_inference = False
        self.model_path = None
        self.max_seq_length = None

    def prepare_model(
        self,
        model_name="Qwen",
        model=None,
        tokenizer=None,
        model_path=None,
        torch_dtype="auto",
        device_map="auto",
        trust_remote_code=True,
        low_cpu_mem_usage=True,
        use_cache=False,
        cache_dir=None,
        deploy_backend="vllm",
        using_multi_nodes=False,
        use_audio_in_video=False,
        attn_implementation="default",
    ) -> Any:
        """Load pretrained model and tokenizer
        Args:
            model_name (str): Name of the model to load.
            model (Any, optional): Preloaded model instance.
                If provided, `model_path` is ignored.
            tokenizer (Any, optional): Preloaded tokenizer instance.
                If model is set, tokenizer must be also set in LLM and VLM.
            model_path (str, optional): Path to the pretrained model.
            torch_dtype (str): Data type for the model weights.
            device_map (str): Device map for the model.
            trust_remote_code (bool): Whether to trust remote code.
            low_cpu_mem_usage (bool): Whether to use low CPU memory usage mode.
            use_cache (bool): Whether to use cache during loading.
            cache_dir (str, optional): Directory to cache the model.
            deploy_backend (str): Backend for deployment, e.g., "torch", "vllm".
            using_multi_nodes (bool): Whether to use multi-nodes for calibration.
            use_audio_in_video (bool): Whether to add audio track to a video file.
            attn_implementation (str): The attention implementation to use in the model.
        """
        assert model_name, "model_name must be specified."
        assert model_path, "model_path must be specified."

        # Normalize device_map for DeepSpeed ZeRO / distributed training: YAML
        # configs often write ``None`` / ``"None"`` / ``"distributed"`` to
        # mean "no pre-placement, let DeepSpeed shard". HF only accepts
        # Python ``None`` there.
        if isinstance(device_map, str) and device_map.lower() in ("none", "distributed"):
            device_map = None

        # Initialize slim model by ModelFactory
        self.slim_model = SlimModelFactory.create(
            model_name, model=model, deploy_backend=deploy_backend
        )

        self.series = SlimModelFactory.get_series_by_models(model_name)

        if self.series in ["LLM", "VLM", "Audio"]:
            if model:
                assert tokenizer, " If model is set, tokenizer must be also set."
                self.slim_model.tokenizer = tokenizer
            else:
                self.slim_model.from_pretrained(
                    model_path,
                    torch_dtype=torch_dtype,
                    device_map=device_map,
                    trust_remote_code=trust_remote_code,
                    low_cpu_mem_usage=low_cpu_mem_usage,
                    use_cache=use_cache,
                    using_multi_nodes=using_multi_nodes,
                )
                self.model_path = model_path
        elif self.series in ["Omni"]:
            if not model:
                self.slim_model.from_pretrained(
                    model_path,
                    torch_dtype=torch_dtype,
                    device_map=device_map,
                    trust_remote_code=trust_remote_code,
                    use_audio_in_video=use_audio_in_video,
                    attn_implementation=attn_implementation,
                )
                self.model_path = model_path
        else:
            raise ValueError(f"Unsupported series: {self.series}")

        return self.slim_model

    def prepare_data(
        self,
        data_path=None,
        data_type="TextDataset",
        custom_dataloader=None,
        max_length=2048,
        batch_size=1,
        num_samples=128,
        shuffle=True,
        inference_settings=None,
        use_audio_in_video=False,
        model_name=None,
        quantization_config=None,
        is_sft_data=False,
        dtype=None,
    ) -> Optional[Any]:
        """Prepare compression dataset"""
        if custom_dataloader is not None:
            print_info("Using custom provided dataloader...")
            self.dataloader = custom_dataloader
            return self.dataloader

        assert data_path, "data_path must be specified."
        # Dynamically create dataloader by DataLoaderFactory
        self.dataloader = DataLoaderFactory.create_data_loader(
            data_type=data_type,
            processor=(
                self.slim_model.processor
                if self.series in ["VLM", "Omni", "Audio"]
                else self.slim_model.tokenizer
            ),
            device=self.slim_model.model.device,
            max_length=max_length,
            batch_size=batch_size,
            shuffle=shuffle,
            num_samples=num_samples,
            data_source=data_path,
            inference_settings=inference_settings,
            use_audio_in_video=use_audio_in_video,
            model_name=model_name,
            quantization_config=quantization_config,
            is_sft_data=is_sft_data,
            dtype=dtype,
        )
        self.max_seq_length = max_length

        return self.dataloader

    def prepare_compressor(
        self,
        compress_name="PTQ",
        global_config=None,
        compress_config=None,
        transform_config=None,
        default_method=None,
    ) -> Any:
        """
        Initialize compression components.
        Args:
            compress_name (str): Name of the compression method to use.
            global_config (dict, optional): Global configuration for the model.
            compress_config (dict, optional): Configuration for the compression method.
            default_method (str, optional): Default compression method if not specified.
               If set default_method, compress_config and global_config will be ignored.
        """
        if isinstance(compress_name, str):
            compress_names = [compress_name]
        elif isinstance(compress_name, list):
            compress_names = compress_name
        for method_name in compress_names:
            if method_name not in CompressorFactory.get_available_compressor():
                raise ValueError(
                    f"Compression method '{method_name}' not registered. "
                    f"Available methods: {CompressorFactory.get_available_compressor()}"
                )
        if self.series in ["LLM", "VLM", "Omni", "Audio"]:
            global_config.update(self.model_path, self.max_seq_length)

        if default_method:
            assert (
                default_method in DEFAULT_COMPRESSION_CONFIG
            ), f"`default_method` not found in : {DEFAULT_COMPRESSION_CONFIG.keys()}."
            slim_config = DEFAULT_COMPRESSION_CONFIG[default_method]
        else:
            slim_config = {
                "global_config": global_config,
                "compress_config": compress_config,
                "transform_config": transform_config,
            }
        self.compress_type = compress_names
        self.only_inference = compress_config.only_inference if compress_config else False
        # Create compressor by CompressorFactory
        self.compressor = CompressorFactory.create(
            compress_names, self.slim_model, slim_config=slim_config
        )
        return self.compressor

    def run(self) -> Any:
        """Execute compression pipeline"""
        if not self.compressor:
            raise RuntimeError("Compressor not initialized. Call prepare_compressor() first")
        if isinstance(self.compressor, str):
            compressors = [self.compressor]
        elif isinstance(self.compressor, list):
            compressors = self.compressor
        for idx, compress_type in enumerate(self.compress_type):
            if self.only_inference[idx]:
                continue
            if compress_type == "PTQ":
                compressors[idx].calibrate(self.dataloader)
            elif compress_type == "QAT":
                compressors[idx].run(self.dataloader)
            elif compress_type == "QAD":
                compressors[idx].run(self.dataloader)
            elif compress_type == "Distill":
                compressors[idx].run(self.dataloader)
            else:
                raise NotImplementedError(
                    f"Compression type {self.compress_type} is not implemented"
                )

    def convert(self):
        if isinstance(self.compressor, str):
            compressors = [self.compressor]
        elif isinstance(self.compressor, list):
            compressors = self.compressor
        for idx, compress_type in enumerate(self.compress_type):
            if self.only_inference[idx]:
                continue
            if compress_type in ["PTQ", "QAT", "QAD", "Distill"]:
                # Execute model conversion
                compressors[idx].convert()

    def save(self, save_path: Optional[str] = None, config: Optional[dataclass] = None) -> None:
        """Save compressed model and tokenizer
        Args:
            save_path (str, optional): Path to save the compressed model and tokenizer.
        """
        assert save_path, "Save path must be provided in model_config or as an argument"

        compressors = self.compressor
        for idx, compress_type in enumerate(self.compress_type):
            if self.only_inference[idx]:
                continue
            # Save quantized model
            compressors[idx].save(save_path)

            # Save all config
            if config is not None and compress_type != "QAT":
                config_dict = asdict(config)
                config_dict["debug_info"] = {
                    "python": sys.version,

... [TRUNCATED] ...
```

### `angelslim\__init__.py`
```
# Copyright 2025 Tencent Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from .engine import Engine  # noqa: F401
```

### `angelslim\compressor\compressor_factory.py`
```
# Copyright 2025 Tencent Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from typing import Any, Callable, Dict, Optional, Type, Union

from ..utils import print_info


class CompressorFactory:
    """
    Factory class for model compression methods with flexible registration.
    Supports both explicit name registration and direct class name registration.
    """

    _compress_methods: Dict[str, Type[Any]] = {}

    @classmethod
    def register(cls, name: Optional[Union[str, Callable]] = None) -> Callable:
        """Decorator to register compression methods. Supports two usage patterns:
        1. @CompressorFactory.register("explicit_name")
        2. @CompressorFactory.register (uses class name as key)
        """

        # Handler for direct class registration (@CompressorFactory.register)
        def register_class(compress_cls: Type[Any]) -> Type[Any]:
            """Register a class using its own name as the key"""
            key = compress_cls.__name__
            if key in cls._compress_methods:
                print_info(f"Compression method '{key}' already exists, will be overwritten.")
            cls._compress_methods[key] = compress_cls
            return compress_cls

        # Handler for named registration (@CompressorFactory.register("name"))
        def register_with_name(key: str) -> Callable[[Type[Any]], Type[Any]]:
            """Decorator that registers a class with a custom key"""

            def decorator(compress_cls: Type[Any]) -> Type[Any]:
                if key in cls._compress_methods:
                    print_info(f"register '{key}' already exists, will be overwritten.")
                cls._compress_methods[key] = compress_cls
                return compress_cls

            return decorator

        # Determine registration type based on input
        if name is None:
            # Case 1: Direct class registration (@CompressorFactory.register)
            return register_class
        elif isinstance(name, str):
            # Case 2: Explicit name registration (@CompressorFactory.register("name"))
            return register_with_name(name)
        elif callable(name):
            # Case 3: Direct class registration (called without parentheses)
            return register_class(name)
        else:
            raise TypeError("Invalid argument type for registration")

    @classmethod
    def create(cls, names: list, model: Any, slim_config: Any) -> Any:
        """Create compressor instance"""
        compressor = []
        for name in names:
            if name not in cls._compress_methods:
                available = list(cls._compress_methods.keys())
                raise ValueError(
                    f"Compress method '{name}' not registered. Available: {available}"
                )
            compressor.append(cls._compress_methods[name](model, slim_config))
        return compressor

    @classmethod
    def get_available_compressor(cls) -> list:
        return list(cls._compress_methods.keys())
```

### `angelslim\compressor\_platform.py`
```
# Copyright 2025 Tencent Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
Platform detection and backend selection for AngelSlim.

This module provides utilities for detecting the runtime environment
and selecting appropriate backends (Triton vs PyTorch) based on
platform capabilities.

Environment Variables:
    ANGELSLIM_BACKEND: Force backend selection ("triton" or "pytorch")
    ANGELSLIM_TORCH_COMPILE: Enable/disable torch.compile ("0" or "1")
"""

import os
import sys
from enum import Enum
from functools import lru_cache

import torch


class Platform(Enum):
    """Supported platforms."""

    LINUX = "linux"
    WINDOWS = "windows"
    MACOS = "macos"
    UNKNOWN = "unknown"


class Backend(Enum):
    """Available computation backends."""

    TRITON = "triton"
    PYTORCH = "pytorch"


@lru_cache(maxsize=1)
def get_platform() -> Platform:
    """Detect the current platform."""
    if sys.platform.startswith("linux"):
        return Platform.LINUX
    elif sys.platform == "win32":
        return Platform.WINDOWS
    elif sys.platform == "darwin":
        return Platform.MACOS
    return Platform.UNKNOWN


@lru_cache(maxsize=1)
def is_triton_available() -> bool:
    """
    Check if Triton is available and functional.

    Returns:
        bool: True if Triton can be used, False otherwise.
    """
    # Check environment variable override
    env_backend = os.environ.get("ANGELSLIM_BACKEND", "").lower()
    if env_backend == "pytorch":
        return False
    if env_backend == "triton":
        # User explicitly requested Triton, try to use it
        try:
            import triton

            if not torch.cuda.is_available():
                raise RuntimeError("ANGELSLIM_BACKEND=triton but CUDA is not available")
            return True
        except ImportError:
            raise RuntimeError("ANGELSLIM_BACKEND=triton but triton is not installed")

    # Auto-detection: check CUDA availability first
    if not torch.cuda.is_available():
        return False

    # Try to import triton
    try:
        import triton  # noqa: F811 F401

        # Test if JIT compilation works
        return _test_triton_jit()
    except ImportError:
        return False
    except Exception:
        return False


def _test_triton_jit() -> bool:
    """
    Test if Triton JIT compilation actually works.

    This is needed because triton-windows may import but fail at JIT time.
    """
    try:
        import triton
        import triton.language as tl

        @triton.jit
        def _test_kernel(x_ptr, BLOCK: tl.constexpr):
            pid = tl.program_id(0)
            offs = pid * BLOCK + tl.arange(0, BLOCK)
            x = tl.load(x_ptr + offs)
            tl.store(x_ptr + offs, x + 1.0)

        # Try to compile and run the kernel
        x = torch.zeros(128, device="cuda", dtype=torch.float32)
        _test_kernel[(1,)](x, BLOCK=128)
        torch.cuda.synchronize()

        # Verify the kernel ran correctly
        return torch.allclose(x, torch.ones(128, device="cuda", dtype=torch.float32))
    except Exception:
        return False


@lru_cache(maxsize=1)
def get_default_backend() -> Backend:
    """
    Get the default computation backend for the current environment.

    Priority:
    1. ANGELSLIM_BACKEND environment variable
    2. Triton if available and functional
    3. PyTorch fallback

    Returns:
        Backend: The selected backend.
    """
    if is_triton_available():
        return Backend.TRITON
    return Backend.PYTORCH


@lru_cache(maxsize=1)
def is_torch_compile_supported() -> bool:
    """
    Check if torch.compile is supported and should be enabled.

    Returns:
        bool: True if torch.compile should be used.
    """
    # Check environment variable override
    env_compile = os.environ.get("ANGELSLIM_TORCH_COMPILE", "").lower()
    if env_compile == "0" or env_compile == "false":
        return False
    if env_compile == "1" or env_compile == "true":
        return True

    # Windows: torch.compile has issues with dynamo
    if get_platform() == Platform.WINDOWS:
        return False

    # Check PyTorch version (torch.compile requires 2.0+)
    try:
        version_parts = torch.__version__.split(".")[:2]
        major = int(version_parts[0])
        if major < 2:
            return False
    except Exception:
        return False

    return True


def use_triton() -> bool:
    """Check if Triton backend should be used."""
    return get_default_backend() == Backend.TRITON


def use_pytorch() -> bool:
    """Check if PyTorch fallback should be used."""
    return get_default_backend() == Backend.PYTORCH


def get_backend_info() -> dict:
    """
    Get detailed information about the current backend configuration.

    Returns:
        dict: Backend information including platform, backend, and capabilities.
    """
    return {
        "platform": get_platform().value,
        "backend": get_default_backend().value,
        "triton_available": is_triton_available(),
        "torch_compile_supported": is_torch_compile_supported(),
        "cuda_available": torch.cuda.is_available(),
        "cuda_device": (torch.cuda.get_device_name() if torch.cuda.is_available() else None),
        "torch_version": torch.__version__,
        "env_backend": os.environ.get("ANGELSLIM_BACKEND", "auto"),
        "env_torch_compile": os.environ.get("ANGELSLIM_TORCH_COMPILE", "auto"),
    }
```

### `angelslim\compressor\__init__.py`
```
# Copyright 2025 Tencent Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from .compressor_factory import CompressorFactory  # noqa: F401
from .distill import Distill  # noqa: F401
from .qad import QAD  # noqa: F401
from .qat.qat import QAT  # noqa: F401
from .quant import PTQ  # noqa: F401
```

### `angelslim\compressor\diffusion\README.md`
```
# AngelSlim Diffusion Model Compression

AngelSlim offers flexible and efficient tools for compressing Diffusion Transformer (DiT) diffusion models. The quantization utilities are modular and easy to integrate into custom inference pipelines.

## Quick Start: FP8 Quantization for Diffusion Models

### Method 1: Quantize with Pre-computed Scales

```python
import torch
from diffusers import FluxPipeline, FluxTransformer2DModel
from angelslim.compressor.diffusion import DynamicDiTQuantizer
from safetensors.torch import load_file

# Load pre-quantized transformer and scales
dit = FluxTransformer2DModel.from_pretrained("/path/to/quantized_model/")
pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-schnell", transformer=dit, torch_dtype=torch.bfloat16)

# Load pre-computed scales
scale = load_file("/path/to/quantized_model/fp8_scales.safetensors")

# Apply quantization with scales
quantizer = DynamicDiTQuantizer(quant_type="fp8-per-tensor")
quantizer.convert_linear(pipe.transformer, scale=scale)

pipe.to("cuda")

# Run pipeline with FP8-quantized transformer
image = pipe(
    "A cat holding a sign that says hello world",
    height=1024,
    width=1024,
    guidance_scale=0.0,
    num_inference_steps=4,
    max_sequence_length=256,
    generator=torch.Generator("cuda").manual_seed(0)
).images[0]
image.save("flux-schnell_fp8_per_tensor.png")
```

### Method 2: Quantize from Scratch

```python
import torch
from diffusers import FluxPipeline
from angelslim.compressor.diffusion import DynamicDiTQuantizer

# Load DiT pipeline with bfloat16 to reduce memory usage
pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-schnell", torch_dtype=torch.bfloat16)

# Supported quantization types: "fp8-per-tensor", "fp8-per-block", "fp8-per-token", "fp8-per-tensor-weight-only"
# If you want to use "fp8-per-block" + DeepGEMM on NVIDIA Hopper (SM90+) devices,
# please refer to https://github.com/deepseek-ai/DeepGEMM for installation instructions.
quantizer = DynamicDiTQuantizer(quant_type="fp8-per-tensor")
quantizer.convert_linear(pipe.transformer)

pipe.to("cuda")

# Run pipeline with FP8-quantized transformer
image = pipe(
    "A cat holding a sign that says hello world",
    height=1024,
    width=1024,
    guidance_scale=0.0,
    num_inference_steps=4,
    max_sequence_length=256,
    generator=torch.Generator("cuda").manual_seed(0)
).images[0]
image.save("flux-schnell_fp8_per_tensor.png")
```

### Method 3: Export Quantized Model

```python
import torch
from diffusers import FluxPipeline
from angelslim.compressor.diffusion import DynamicDiTQuantizer

# Load and quantize model
pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-schnell", torch_dtype=torch.bfloat16)
quantizer = DynamicDiTQuantizer(quant_type="fp8-per-tensor")

# Export quantized weights and scales
quantizer.export_quantized_weight(pipe.transformer, save_path="/path/to/save/quantized_model/")
```

## Supported Quantization Types

AngelSlim supports four FP8 quantization strategies:

- **`fp8-per-tensor`**: Per-tensor quantization for both weights and activations (recommended for most use cases)
- **`fp8-per-tensor-weight-only`**: Weight-only quantization with per-tensor scaling (weights: FP8, activations: BF16/FP16)
- **`fp8-per-block`**: Per-block quantization with DeepGEMM support for NVIDIA Hopper (SM90+) devices
- **`fp8-per-token`**: Per-token quantization for fine-grained control

## Customizable Quantization Layer Selection

AngelSlim provides fine-grained control over which layers are quantized. You can specify inclusion and exclusion patterns as substrings or regular expressions.

```python
from angelslim.compressor.diffusion import DynamicDiTQuantizer

# Option 1: Default filtering (quantizes common linear layers)
quantizer = DynamicDiTQuantizer(quant_type="fp8-per-tensor")

# Option 2: String-based include/exclude patterns
quantizer = DynamicDiTQuantizer(
    quant_type="fp8-per-tensor",
    include_patterns=["linear", "attention"],
    exclude_patterns=["embed", "norm"]
)

# Option 3: Regex pattern matching (auto-detected)
quantizer = DynamicDiTQuantizer(
    quant_type="fp8-per-tensor",
    include_patterns=[r".*\.linear\d+", r".*\.attn.*"],
    exclude_patterns=[r".*embed.*"]
)

# Option 4: Mix of strings and regex for flexible rules
quantizer = DynamicDiTQuantizer(
    quant_type="fp8-per-tensor",
    include_patterns=["linear", r".*\.attn.*"],
    exclude_patterns=["embed", r".*norm.*"]
)
```

## API Reference

### DynamicDiTQuantizer

The main quantizer class for DiT models.

#### Constructor Parameters

- `quant_type` (str): Quantization type - "fp8-per-tensor", "fp8-per-tensor-weight-only", "fp8-per-block", or "fp8-per-token"
- `layer_filter` (Callable, optional): Custom function to determine which layers to quantize
- `include_patterns` (List[str|re.Pattern], optional): Patterns for layers to include
- `exclude_patterns` (List[str|re.Pattern], optional): Patterns for layers to exclude
- `native_fp8_support` (bool, optional): Whether to use native FP8 support (auto-detected if None)

#### Methods

- `convert_linear(model, scale=None)`: Convert linear layers to quantized versions
  - `model`: The DiT model to quantize
  - `scale`: Optional pre-computed scales (dict or safetensors file)
- `export_quantized_weight(model, save_path)`: Export quantized model and scales
  - `model`: The quantized model
  - `save_path`: Directory to save the model and fp8_scales.safetensors

For more details on customizing quantization behavior, see the API documentation.
```

### `angelslim\compressor\diffusion\__init__.py`
```
# Copyright 2025 Tencent Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from .cache import *  # noqa: F401 F403
from .quant import *  # noqa: F401 F403
```

### `angelslim\compressor\diffusion\cache\cache_helper.py`
```
from typing import Any, Callable, Dict, List, Optional, Set, Tuple


class CacheHelper:
    """
    Cache helper class for managing caching of Diffusion models.

    This class wraps the forward methods of modules to cache output
    results at specified steps, enabling cache reuse in subsequent steps
    to improve inference efficiency.
    """

    def __init__(
        self,
        double_blocks: Optional[List] = None,
        single_blocks: Optional[List] = None,
        no_cache_steps: Optional[Set[int]] = None,
    ):
        """
        Initialize CacheHelper.

        Args:
            double_blocks: List of double block modules
            single_blocks: List of single block modules
            no_cache_steps: Set of steps where caching should not be used
        """
        self.double_blocks = double_blocks if double_blocks is not None else []
        self.single_blocks = single_blocks if single_blocks is not None else []
        self.no_cache_steps = no_cache_steps if no_cache_steps is not None else set()

        self.start_timestep: Optional[int] = None
        self.cur_timestep: int = 0
        self.function_dict: Dict[Tuple[str, int], Callable] = {}
        self.cached_output: Dict[Tuple[str, int], List] = {}

    def enable(self) -> None:
        """
        Enable caching functionality.

        Raises:
            ValueError: Raised when both double_blocks and single_blocks are empty
        """
        if not self.double_blocks and not self.single_blocks:
            raise ValueError("At least one of double_blocks or single_blocks must be provided")

        self.reset_states()
        self.wrap_modules()

    def disable(self) -> None:
        """Disable caching functionality and restore original forward methods."""
        self.unwrap_modules()
        self.reset_states()

    def is_skip(self) -> bool:
        """
        Determine whether the current step should skip.

        Returns:
            bool: True means use cache, False means recompute
        """
        # For some pipelines, the first timestep may not be 0
        if self.start_timestep is None:
            self.start_timestep = self.cur_timestep

        # If current step is in no_cache_steps, do not use cache
        if self.cur_timestep - self.start_timestep in self.no_cache_steps:
            return False

        return True

    def wrap_block_forward(self, block: Any, block_id: int, blocktype: str) -> None:
        """
        Wrap a single block's forward method with caching logic.

        Args:
            block: The block module to wrap
            block_id: The index ID of the block
            blocktype: The type of block ("double_blocks" or "single_blocks")
        """
        # Save the original forward method
        self.function_dict[(blocktype, block_id)] = block.forward

        def wrapped_forward(*args, **kwargs):
            """Wrapped forward method with caching logic."""
            skip = self.is_skip()

            if skip:
                # Use cached output
                result = self.cached_output[(blocktype, block_id)]
            else:
                # Recompute and cache the result
                result = self.function_dict[(blocktype, block_id)](*args, **kwargs)
                self.cached_output[(blocktype, block_id)] = result

            return result

        block.forward = wrapped_forward

    def wrap_modules(self) -> None:
        """Wrap forward methods of all blocks."""
        # Wrap double blocks
        if self.double_blocks:
            for block_id, block in enumerate(self.double_blocks):
                self.wrap_block_forward(block, block_id, blocktype="double_blocks")

        # Wrap single blocks
        if self.single_blocks:
            for block_id, block in enumerate(self.single_blocks):
                self.wrap_block_forward(block, block_id, blocktype="single_blocks")

    def unwrap_modules(self) -> None:
        """Restore original forward methods of all blocks."""
        # Restore double blocks
        if self.double_blocks:
            for block_id, block in enumerate(self.double_blocks):
                key = ("double_blocks", block_id)
                if key in self.function_dict:
                    block.forward = self.function_dict[key]

        # Restore single blocks
        if self.single_blocks:
            for block_id, block in enumerate(self.single_blocks):
                key = ("single_blocks", block_id)
                if key in self.function_dict:
                    block.forward = self.function_dict[key]

    def reset_states(self) -> None:
        """Reset all internal states."""
        self.start_timestep = None
        self.cur_timestep = 0
        self.function_dict = {}
        self.cached_output = {}

    def clear_states(self) -> None:
        """Clear cache states but preserve function_dict."""
        self.cur_timestep = 0
        self.start_timestep = None
        self.cached_output = {}
```

### `angelslim\compressor\diffusion\cache\deepcache_helper.py`
```
from typing import Any, Dict, List, Optional, Set

from .cache_helper import CacheHelper


class DeepCacheHelper(CacheHelper):
    """
    DeepCache helper class that extends CacheHelper with block-level caching control.

    This class inherits from CacheHelper and adds the ability to skip caching for
    specific blocks based on their IDs and types, providing fine-grained control
    over the caching behavior.
    """

    def __init__(
        self,
        double_blocks: Optional[List] = None,
        single_blocks: Optional[List] = None,
        no_cache_steps: Optional[Set[int]] = None,
        no_cache_block_id: Optional[Dict[str, Set[int]]] = None,
    ):
        """
        Initialize DeepCacheHelper.

        Args:
            double_blocks: List of double block modules, can be None
            single_blocks: List of single block modules, can be None
            no_cache_steps: Set of steps where caching should not be used
            no_cache_block_id: Dictionary mapping block types("double_blocks",
            "single_blocks") to sets of block IDs that should not be cached
        """
        super().__init__(
            double_blocks=double_blocks,
            single_blocks=single_blocks,
            no_cache_steps=no_cache_steps,
        )
        self.no_cache_block_id = no_cache_block_id if no_cache_block_id is not None else {}

    def is_skip(self, block_id: int, blocktype: str) -> bool:
        # For some pipelines, the first timestep may not be 0
        if self.start_timestep is None:
            self.start_timestep = self.cur_timestep

        # If current step is in no_cache_steps, do not use cache
        if self.cur_timestep - self.start_timestep in self.no_cache_steps:
            return False

        # If current block is in no_cache_block_id, do not use cache
        if self.no_cache_block_id and blocktype in self.no_cache_block_id:
            if block_id in self.no_cache_block_id[blocktype]:
                return False

        return True

    def wrap_block_forward(self, block: Any, block_id: int, blocktype: str) -> None:
        # Save the original forward method
        self.function_dict[(blocktype, block_id)] = block.forward

        def wrapped_forward(*args, **kwargs):
            """Wrapped forward method with caching logic."""
            skip = self.is_skip(block_id, blocktype)

            if skip:
                # Use cached output
                result = self.cached_output[(blocktype, block_id)]
            else:
                # Recompute and cache the result
                result = self.function_dict[(blocktype, block_id)](*args, **kwargs)
                self.cached_output[(blocktype, block_id)] = result

            return result

        block.forward = wrapped_forward
```

### `angelslim\compressor\diffusion\cache\taylorcache_helper.py`
```
import math
from typing import Any, Callable, List, Optional, Set, Tuple

import torch
import torch.nn as nn

from .cache_helper import CacheHelper

# Conditional torch.compile decorator
# Disabled on Windows and when ANGELSLIM_TORCH_COMPILE=0
try:
    from angelslim.compressor._platform import is_torch_compile_supported

    _USE_TORCH_COMPILE = is_torch_compile_supported()
except ImportError:
    _USE_TORCH_COMPILE = False


def _conditional_compile(func: Callable) -> Callable:
    """Apply torch.compile only if supported on this platform."""
    if _USE_TORCH_COMPILE:
        return torch.compile(func)
    return func


class TaylorCacheHelper(CacheHelper):
    """
    TaylorCache helper class that extends CacheHelper with Taylor expansion-based.

    This class implements a caching strategy using Taylor series expansion to predict
    future outputs based on derivatives computed from previous steps. It decomposes
    tensors into low and high frequency components for more accurate approximation.
    """

    def __init__(
        self,
        double_blocks: Optional[List] = None,
        single_blocks: Optional[List] = None,
        no_cache_steps: Optional[Set[int]] = None,
        max_order: int = 2,
        low_freqs_order: int = 2,
        high_freqs_order: int = 2,
    ):
        """
        Initialize TaylorCacheHelper.

        Args:
            double_blocks: List of double block modules, can be None
            single_blocks: List of single block modules, can be None
            no_cache_steps: Set of steps where caching should not be used
            max_order: Maximum order of Taylor expansion
            low_freqs_order: Order for computing low frequency derivatives
            high_freqs_order: Order for computing high frequency derivatives
        """
        super().__init__(
            double_blocks=double_blocks,
            single_blocks=single_blocks,
            no_cache_steps=no_cache_steps,
        )
        self.max_order = max_order
        self.low_freqs_order = low_freqs_order
        self.high_freqs_order = high_freqs_order
        self.counter = 0

        self.taylor_cache = CacheWithFreqsContainer(self.max_order)

    def is_skip(self) -> bool:
        # For some pipelines, the first timestep may not be 0
        if self.start_timestep is None:
            self.start_timestep = self.cur_timestep
            self.last_full_computation_step = self.start_timestep

        # If current step is in no_cache_steps, do not use cache
        if self.cur_timestep - self.start_timestep in self.no_cache_steps:
            return False

        return True

    def wrap_block_forward(self, block: Any, block_id: int, blocktype: str) -> None:
        # Save the original forward method
        self.function_dict[(blocktype, block_id)] = block.forward

        def wrapped_forward(*args, **kwargs):
            """Wrapped forward method with caching logic."""
            skip = self.is_skip()

            if skip:
                # Use cached output
                if blocktype == "double_blocks":
                    is_last_double_block = block_id == len(self.double_blocks) - 1
                    if not self.single_blocks and is_last_double_block:
                        self.counter += 1
                        output = self.taylor_cache.taylor_formula(distance=self.counter)
                        result = [output, self.cached_output[(blocktype, block_id)][1]]
                    else:
                        result = self.cached_output[(blocktype, block_id)]
                if blocktype == "single_blocks":
                    is_last_single_block = block_id == len(self.single_blocks) - 1
                    if is_last_single_block:
                        self.counter += 1
                        result = self.taylor_cache.taylor_formula(distance=self.counter)
                    else:
                        result = self.cached_output[(blocktype, block_id)]
            else:
                # Recompute and cache the result
                self.counter = 0
                result = self.function_dict[(blocktype, block_id)](*args, **kwargs)
                self.cached_output[(blocktype, block_id)] = result
                if not self.single_blocks:
                    is_last_double_block = block_id == len(self.double_blocks) - 1
                    if blocktype == "double_blocks" and is_last_double_block:
                        cached_output = result[0]
                        distance = self.cur_timestep - self.last_full_computation_step
                        if self.cur_timestep != self.start_timestep:
                            self.taylor_cache.derivatives_computation(
                                cached_output,
                                distance=distance,
                                low_freqs_order=self.low_freqs_order,
                                high_freqs_order=self.high_freqs_order,
                            )
                        self.last_full_computation_step = self.cur_timestep
                else:
                    is_last_single_block = block_id == len(self.single_blocks) - 1
                    if blocktype == "single_blocks" and is_last_single_block:
                        cached_output = result
                        distance = self.cur_timestep - self.last_full_computation_step
                        if self.cur_timestep != self.start_timestep:
                            self.taylor_cache.derivatives_computation(
                                cached_output,
                                distance=distance,
                                low_freqs_order=self.low_freqs_order,
                                high_freqs_order=self.high_freqs_order,
                            )
                        self.last_full_computation_step = self.cur_timestep

            return result

        block.forward = wrapped_forward

    def reset_states(self) -> None:
        """Reset all internal states."""
        self.start_timestep = None
        self.cur_timestep = 0
        self.function_dict = {}
        self.cached_output = {}
        self.taylor_cache.clear_derivatives()

    def clear_states(self) -> None:
        """Clear cache states but preserve function_dict."""
        self.cur_timestep = 0
        self.start_timestep = None
        self.cached_output = {}
        self.taylor_cache.clear_derivatives()


@_conditional_compile
def decomposition_FFT(
    x: torch.Tensor, cutoff_ratio: float = 0.1
) -> Tuple[torch.Tensor, torch.Tensor]:
    """
    Decompose tensor into low and high frequency components
    using Fast Fourier Transform.

    Args:
        x: Input tensor of shape [B, H*W, D]
        cutoff_ratio: Cutoff frequency ratio for separating
        low/high frequencies (0~0.5, default: 0.1)

    Returns:
        Tuple of (low_freq, high_freq) tensors with same shape and dtype as input
    """
    orig_dtype = x.dtype
    device = x.device

    x_fp32 = x.to(torch.float32)

    B, HW, D = x_fp32.shape

    # FFT on spatial dimension
    freq = torch.fft.fft(x_fp32, dim=1)

    freqs = torch.fft.fftfreq(HW, d=1.0, device=device)
    cutoff = cutoff_ratio * freqs.abs().max()

    # Create frequency masks
    low_mask = freqs.abs() <= cutoff
    high_mask = ~low_mask

    # Broadcast masks to match tensor shape (B, HW, D)
    low_mask = low_mask[None, :, None]
    high_mask = high_mask[None, :, None]

    low_freq_complex = freq * low_mask
    high_freq_complex = freq * high_mask

    # IFFT and take real part
    low_fp32 = torch.fft.ifft(low_freq_complex, dim=1).real
    high_fp32 = torch.fft.ifft(high_freq_complex, dim=1).real

    # Convert back to original dtype
    low = low_fp32.to(device=device, dtype=orig_dtype)
    high = high_fp32.to(device=device, dtype=orig_dtype)

    return low, high


@_conditional_compile
def reconstruction(low_freq: torch.Tensor, high_freq: torch.Tensor) -> torch.Tensor:
    return low_freq + high_freq


class CacheWithFreqsContainer(nn.Module):
    def __init__(self, max_order: int):
        super().__init__()
        self.max_order = max_order

        # Register buffers for derivatives and temporary derivatives
        for i in range(max_order + 1):
            self.register_buffer(f"derivative_{i}_low_freqs", None, persistent=False)
            self.register_buffer(f"derivative_{i}_high_freqs", None, persistent=False)
            self.register_buffer(f"temp_derivative_{i}_low_freqs", None, persistent=False)
            self.register_buffer(f"temp_derivative_{i}_high_freqs", None, persistent=False)

    def get_derivative(self, order: int, freqs: str) -> Optional[torch.Tensor]:
        return getattr(self, f"derivative_{order}_{freqs}")

    def set_derivative(self, order: int, freqs: str, tensor: torch.Tensor) -> None:
        setattr(self, f"derivative_{order}_{freqs}", tensor)

    def set_temp_derivative(self, order: int, freqs: str, tensor: torch.Tensor) -> None:
        setattr(self, f"temp_derivative_{order}_{freqs}", tensor)

    def get_temp_derivative(self, order: int, freqs: str) -> Optional[torch.Tensor]:
        return getattr(self, f"temp_derivative_{order}_{freqs}")

    def move_temp_to_derivative(self) -> None:
        for i in range(self.max_order + 1):
            if self.get_temp_derivative(i, "low_freqs") is not None:
                setattr(
                    self,
                    f"derivative_{i}_low_freqs",
                    self.get_temp_derivative(i, "low_freqs"),
                )
            if self.get_temp_derivative(i, "high_freqs") is not None:
                setattr(
                    self,
                    f"derivative_{i}_high_freqs",
                    self.get_temp_derivative(i, "high_freqs"),
                )
        self.clear_temp_derivative()

    def get_all_filled_derivatives(self, freqs: str) -> List[torch.Tensor]:
        return [
            self.get_derivative(i, freqs)
            for i in range(self.max_order + 1)
            if self.get_derivative(i, freqs) is not None
        ]

    def taylor_formula(self, distance: int) -> torch.Tensor:
        low_freqs_output = 0
        high_freqs_output = 0
        for i in range(len(self.get_all_filled_derivatives("low_freqs"))):
            coefficient = 1 / math.factorial(i)
            low_freqs_output += coefficient * self.get_derivative(i, "low_freqs") * (distance**i)
        for i in range(len(self.get_all_filled_derivatives("high_freqs"))):
            coefficient = 1 / math.factorial(i)
            high_freqs_output += coefficient * self.get_derivative(i, "high_freqs") * (distance**i)

        return reconstruction(low_freqs_output, high_freqs_output)

    def derivatives_computation(
        self,
        x: torch.Tensor,
        distance: int,
        low_freqs_order: int,
        high_freqs_order: int,
    ) -> None:
        x_low, x_high = decomposition_FFT(x, cutoff_ratio=0.1)
        self.set_temp_derivative(0, "low_freqs", x_low)
        self.set_temp_derivative(0, "high_freqs", x_high)
        for i in range(low_freqs_order):
            if self.get_derivative(i, "low_freqs") is not None:
                derivative_diff = self.get_temp_derivative(i, "low_freqs") - self.get_derivative(
                    i, "low_freqs"
                )
                self.set_temp_derivative(i + 1, "low_freqs", derivative_diff / distance)
        for i in range(high_freqs_order):
            if self.get_derivative(i, "high_freqs") is not None:
                derivative_diff = self.get_temp_derivative(i, "high_freqs") - self.get_derivative(
                    i, "high_freqs"
                )
                self.set_temp_derivative(i + 1, "high_freqs", derivative_diff / distance)
        self.move_temp_to_derivative()

    def clear_temp_derivative(self) -> None:
        for i in range(self.max_order + 1):
            setattr(self, f"temp_derivative_{i}_low_freqs", None)
            setattr(self, f"temp_derivative_{i}_high_freqs", None)

    def clear_derivatives(self) -> None:

... [TRUNCATED] ...
```

### `angelslim\compressor\diffusion\cache\teacache_helper.py`
```
from typing import Any, List, Optional, Set

import torch

from .cache_helper import CacheHelper


class TeaCacheHelper(CacheHelper):
    """
    TeaCache helper class that extends CacheHelper with residual-based caching.

    This class implements a caching strategy that stores the residual (difference)
    between the input and output of the last block, allowing for efficient cache
    reuse by adding the residual to the cached input.
    """

    def __init__(
        self,
        double_blocks: Optional[List] = None,
        single_blocks: Optional[List] = None,
        no_cache_steps: Optional[Set[int]] = None,
        cache_name: str = "img",
    ):
        """
        Initialize TeaCacheHelper.

        Args:
            double_blocks: List of double block modules, can be None
            single_blocks: List of single block modules, can be None
            no_cache_steps: Set of steps where caching should not be used
            cache_name: Name of the input field in kwargs to cache (default: "img")
        """
        super().__init__(
            double_blocks=double_blocks,
            single_blocks=single_blocks,
            no_cache_steps=no_cache_steps,
        )
        self.cache_name = cache_name
        self.cached_input: Optional[torch.Tensor] = None
        self.previous_residual: Optional[torch.Tensor] = None

    def wrap_block_forward(self, block: Any, block_id: int, blocktype: str) -> None:
        # Save the original forward method
        self.function_dict[(blocktype, block_id)] = block.forward

        def wrapped_forward(*args, **kwargs):
            """Wrapped forward method with residual-based caching logic."""
            skip = self.is_skip()

            if skip:
                # Use cached output
                if blocktype == "double_blocks":
                    is_last_double_block = block_id == len(self.double_blocks) - 1
                    if not self.single_blocks and is_last_double_block:
                        result = [
                            self.cached_input + self.previous_residual,
                            self.cached_output[(blocktype, block_id)][1],
                        ]
                    else:
                        result = self.cached_output[(blocktype, block_id)]

                elif blocktype == "single_blocks":
                    is_last_single_block = block_id == len(self.single_blocks) - 1
                    if is_last_single_block:
                        result = self.cached_input + self.previous_residual
                    else:
                        result = self.cached_output[(blocktype, block_id)]
            else:
                # Recompute and cache the result
                result = self.function_dict[(blocktype, block_id)](*args, **kwargs)
                self.cached_output[(blocktype, block_id)] = result

                if blocktype == "double_blocks" and block_id == 0:
                    self.cached_input = kwargs[self.cache_name]

                if not self.single_blocks:
                    is_last_double_block = block_id == len(self.double_blocks) - 1
                    if blocktype == "double_blocks" and is_last_double_block:
                        cached_output = result[0]
                        self.previous_residual = cached_output - self.cached_input
                else:
                    is_last_single_block = block_id == len(self.single_blocks) - 1
                    if blocktype == "single_blocks" and is_last_single_block:
                        img_seq_len = self.cached_output[("double_blocks", 0)][0].shape[1]
                        cached_output = result[:, :img_seq_len, ...]
                        self.previous_residual = cached_output - self.cached_input

            return result

        block.forward = wrapped_forward
```

### `angelslim\compressor\diffusion\cache\__init__.py`
```
# Copyright 2025 Tencent Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from .cache_helper import CacheHelper
from .deepcache_helper import DeepCacheHelper
from .taylorcache_helper import TaylorCacheHelper
from .teacache_helper import TeaCacheHelper

__all__ = [
    "CacheHelper",
    "DeepCacheHelper",
    "TaylorCacheHelper",
    "TeaCacheHelper",
]
```
