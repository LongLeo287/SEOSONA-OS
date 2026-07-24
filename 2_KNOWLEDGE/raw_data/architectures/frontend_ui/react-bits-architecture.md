# Architecture Extract: react-bits

## Directory Structure
```text
react-bits/
    .assetsignore
    .eslintrc.cjs
    .gitignore
    .prettierignore
    .prettierrc
    CONTRIBUTING.md
    index.html
    jsrepo.config.ts
    LICENSE.md
    package-lock.json
    package.json
    README.md
    tsconfig.json
    vite.config.js
    wrangler.jsonc
    .context/
        new-component.md
    .github/
        FUNDING.yml
        ISSUE_TEMPLATE/
            1-bug-report.yml
            2-feature-request.yml
    public/
        favicon.ico
        llms.txt
        README.md
        robots.txt
        site.webmanifest
        sitemap.xml
        assets/
            3d/
                bar.glb
                cube.glb
                lens.glb
            demo/
            fonts/
                figtreeblack.ttf
            gif/
            rbp/
            showcase/
            sounds/
            sponsors/
            video/
                animatedcontent.webm
                animatedlist.webm
                antigravity.webm
                asciitext.webm
                aurora.webm
                balatro.webm
                ballpit.webm
                beams.webm
                blobcursor.webm
                blurtext.webm
                borderglow.webm
                bouncecards.webm
                bubblemenu.webm
                cardnav.webm
                cardswap.webm
                carousel.webm
                chromagrid.webm
                circulargallery.webm
                circulartext.webm
                clickspark.webm
                colorbends.webm
                counter.webm
                countup.webm
                crosshair.webm
                cubes.webm
                curvedloop.webm
                darkveil.webm
                decaycard.webm
                decryptedtext.webm
                dither.webm
                dock.webm
                domegallery.webm
                dotfield.webm
                dotgrid.webm
                elasticslider.webm
                electricborder.webm
                evileye.webm
                fadecontent.webm
                fallingtext.webm
                faultyterminal.webm
                ferrofulid.webm
                floatinglines.webm
                flowingmenu.webm
                fluidglass.webm
                flyingposters.webm
                folder.webm
                fuzzytext.webm
                galaxy.webm
                ghostcursor.webm
                glarehover.webm
                glassicons.webm
                glasssurface.webm
                glitchtext.webm
                gooeynav.webm
                gradientblinds.webm
                gradienttext.webm
                gradualblur.webm
                grainient.webm
                griddistortion.webm
                gridmotion.webm
                gridscan.webm
                hyperspeed.webm
                imagetrail.webm
                infinitemenu.webm
                infinitescroll.webm
                iridescence.webm
                lanyard.webm
                laserflow.webm
                letterglitch.webm
                lightfall.webm
                lightning.webm
                lightpillar.webm
                lightrays.webm
                linewaves.webm
                liquidchrome.webm
                liquidether.webm
                logoloop.webm
                magicbento.webm
                magicrings.webm
                magnet.webm
                magnetlines.webm
                masonry.webm
                metaballs.webm
                metallicpaint.webm
                modelviewer.webm
                noise.webm
                orb.webm
                orbitimages.webm
                particles.webm
                pillnav.webm
                pixelblast.webm
                pixelcard.webm
                pixelsnow.webm
                pixeltrail.webm
                pixeltransition.webm
                plasma.webm
                plasmawave.webm
                prism.webm
                prismaticburst.webm
                profilecard.webm
                radar.webm
                reflectivecard.webm
                ribbons.webm
                ripplegrid.webm
                rotatingtext.webm
                scrambledtext.webm
                scrollfloat.webm
                scrollreveal.webm
                scrollstack.webm
                scrollvelocity.webm
                shapeblur.webm
                shinytext.webm
                shuffle.webm
                siderays.webm
                silk.webm
                softaurora.webm
                splashcursor.webm
                splittext.webm
                spotlightcard.webm
                squares.webm
                stack.webm
                staggeredmenu.webm
                starborder.webm
                stepper.webm
                stickerpeel.webm
                strands.webm
                targetcursor.webm
                textcursor.webm
                textpressure.webm
                textrotate.webm
                texttype.webm
                threads.webm
                tiltedcard.webm
                truefocus.webm
                variableproximity.webm
                waves.webm
        r/
            AnimatedContent-JS-CSS.json
            AnimatedContent-JS-TW.json
            AnimatedContent-TS-CSS.json
            AnimatedContent-TS-TW.json
            AnimatedList-JS-CSS.json
            AnimatedList-JS-TW.json
            AnimatedList-TS-CSS.json
            AnimatedList-TS-TW.json
            Antigravity-JS-CSS.json
            Antigravity-JS-TW.json
            Antigravity-TS-CSS.json
            Antigravity-TS-TW.json
            ASCIIText-JS-CSS.json
            ASCIIText-JS-TW.json
            ASCIIText-TS-CSS.json
            ASCIIText-TS-TW.json
            Aurora-JS-CSS.json
            Aurora-JS-TW.json
            Aurora-TS-CSS.json
            Aurora-TS-TW.json
            Balatro-JS-CSS.json
            Balatro-JS-TW.json
            Balatro-TS-CSS.json
            Balatro-TS-TW.json
            Ballpit-JS-CSS.json
            Ballpit-JS-TW.json
            Ballpit-TS-CSS.json
            Ballpit-TS-TW.json
            Beams-JS-CSS.json
            Beams-JS-TW.json
            Beams-TS-CSS.json
            Beams-TS-TW.json
            BlobCursor-JS-CSS.json
            BlobCursor-JS-TW.json
            BlobCursor-TS-CSS.json
            BlobCursor-TS-TW.json
            BlurText-JS-CSS.json
            BlurText-JS-TW.json
            BlurText-TS-CSS.json
            BlurText-TS-TW.json
            BorderGlow-JS-CSS.json
            BorderGlow-JS-TW.json
            BorderGlow-TS-CSS.json
            BorderGlow-TS-TW.json
            BounceCards-JS-CSS.json
            BounceCards-JS-TW.json
            BounceCards-TS-CSS.json
            BounceCards-TS-TW.json
            BubbleMenu-JS-CSS.json
            BubbleMenu-JS-TW.json
            BubbleMenu-TS-CSS.json
            BubbleMenu-TS-TW.json
            CardNav-JS-CSS.json
            CardNav-JS-TW.json
            CardNav-TS-CSS.json
            CardNav-TS-TW.json
            CardSwap-JS-CSS.json
            CardSwap-JS-TW.json
            CardSwap-TS-CSS.json
            CardSwap-TS-TW.json
            Carousel-JS-CSS.json
            Carousel-JS-TW.json
            Carousel-TS-CSS.json
            Carousel-TS-TW.json
            ChromaGrid-JS-CSS.json
            ChromaGrid-JS-TW.json
            ChromaGrid-TS-CSS.json
            ChromaGrid-TS-TW.json
            CircularGallery-JS-CSS.json
            CircularGallery-JS-TW.json
            CircularGallery-TS-CSS.json
            CircularGallery-TS-TW.json
            CircularText-JS-CSS.json
            CircularText-JS-TW.json
            CircularText-TS-CSS.json
            CircularText-TS-TW.json
            ClickSpark-JS-CSS.json
            ClickSpark-JS-TW.json
            ClickSpark-TS-CSS.json
            ClickSpark-TS-TW.json
            ColorBends-JS-CSS.json
            ColorBends-JS-TW.json
            ColorBends-TS-CSS.json
            ColorBends-TS-TW.json
            Counter-JS-CSS.json
            Counter-JS-TW.json
            Counter-TS-CSS.json
            Counter-TS-TW.json
            CountUp-JS-CSS.json
            CountUp-JS-TW.json
            CountUp-TS-CSS.json
            CountUp-TS-TW.json
            Crosshair-JS-CSS.json
            Crosshair-JS-TW.json
            Crosshair-TS-CSS.json
            Crosshair-TS-TW.json
            Cubes-JS-CSS.json
            Cubes-JS-TW.json
            Cubes-TS-CSS.json
            Cubes-TS-TW.json
            CurvedLoop-JS-CSS.json
            CurvedLoop-JS-TW.json
            CurvedLoop-TS-CSS.json
            CurvedLoop-TS-TW.json
            DarkVeil-JS-CSS.json
            DarkVeil-JS-TW.json
            DarkVeil-TS-CSS.json
            DarkVeil-TS-TW.json
            DecayCard-JS-CSS.json
            DecayCard-JS-TW.json
            DecayCard-TS-CSS.json
            DecayCard-TS-TW.json
            DecryptedText-JS-CSS.json
            DecryptedText-JS-TW.json
            DecryptedText-TS-CSS.json
            DecryptedText-TS-TW.json
            Dither-JS-CSS.json
            Dither-JS-TW.json
            Dither-TS-CSS.json
            Dither-TS-TW.json
            Dock-JS-CSS.json
            Dock-JS-TW.json
            Dock-TS-CSS.json
            Dock-TS-TW.json
            DomeGallery-JS-CSS.json
            DomeGallery-JS-TW.json
            DomeGallery-TS-CSS.json
            DomeGallery-TS-TW.json
            DotField-JS-CSS.json
            DotField-JS-TW.json
            DotField-TS-CSS.json
            DotField-TS-TW.json
            DotGrid-JS-CSS.json
            DotGrid-JS-TW.json
            DotGrid-TS-CSS.json
            DotGrid-TS-TW.json
            ElasticSlider-JS-CSS.json
            ElasticSlider-JS-TW.json
            ElasticSlider-TS-CSS.json
            ElasticSlider-TS-TW.json
            ElectricBorder-JS-CSS.json
            ElectricBorder-JS-TW.json
            ElectricBorder-TS-CSS.json
            ElectricBorder-TS-TW.json
            EvilEye-JS-CSS.json
            EvilEye-JS-TW.json
            EvilEye-TS-CSS.json
            EvilEye-TS-TW.json
            FadeContent-JS-CSS.json
            FadeContent-JS-TW.json
            FadeContent-TS-CSS.json
            FadeContent-TS-TW.json
            FallingText-JS-CSS.json
            FallingText-JS-TW.json
            FallingText-TS-CSS.json
            FallingText-TS-TW.json
            FaultyTerminal-JS-CSS.json
            FaultyTerminal-JS-TW.json
            FaultyTerminal-TS-CSS.json
            FaultyTerminal-TS-TW.json
            Ferrofluid-JS-CSS.json
            Ferrofluid-JS-TW.json
            Ferrofluid-TS-CSS.json
            Ferrofluid-TS-TW.json
            FloatingLines-JS-CSS.json
            FloatingLines-JS-TW.json
            FloatingLines-TS-CSS.json
            FloatingLines-TS-TW.json
            FlowingMenu-JS-CSS.json
            FlowingMenu-JS-TW.json
            FlowingMenu-TS-CSS.json
            FlowingMenu-TS-TW.json
            FluidGlass-JS-CSS.json
            FluidGlass-JS-TW.json
            FluidGlass-TS-CSS.json
            FluidGlass-TS-TW.json
            FlyingPosters-JS-CSS.json
            FlyingPosters-JS-TW.json
            FlyingPosters-TS-CSS.json
            FlyingPosters-TS-TW.json
            Folder-JS-CSS.json
            Folder-JS-TW.json
            Folder-TS-CSS.json
            Folder-TS-TW.json
            FuzzyText-JS-CSS.json
            FuzzyText-JS-TW.json
            FuzzyText-TS-CSS.json
            FuzzyText-TS-TW.json
            Galaxy-JS-CSS.json
            Galaxy-JS-TW.json
            Galaxy-TS-CSS.json
            Galaxy-TS-TW.json
            GhostCursor-JS-CSS.json
            GhostCursor-JS-TW.json
            GhostCursor-TS-CSS.json
            GhostCursor-TS-TW.json
            GlareHover-JS-CSS.json
            GlareHover-JS-TW.json
            GlareHover-TS-CSS.json
            GlareHover-TS-TW.json
            GlassIcons-JS-CSS.json
            GlassIcons-JS-TW.json
            GlassIcons-TS-CSS.json
            GlassIcons-TS-TW.json
            GlassSurface-JS-CSS.json
            GlassSurface-JS-TW.json
            GlassSurface-TS-CSS.json
            GlassSurface-TS-TW.json
            GlitchText-JS-CSS.json
            GlitchText-JS-TW.json
            GlitchText-TS-CSS.json
            GlitchText-TS-TW.json
            GooeyNav-JS-CSS.json
            GooeyNav-JS-TW.json
            GooeyNav-TS-CSS.json
            GooeyNav-TS-TW.json
            GradientBlinds-JS-CSS.json
            GradientBlinds-JS-TW.json
            GradientBlinds-TS-CSS.json
            GradientBlinds-TS-TW.json
            GradientText-JS-CSS.json
            GradientText-JS-TW.json
            GradientText-TS-CSS.json
            GradientText-TS-TW.json
            GradualBlur-JS-CSS.json
            GradualBlur-JS-TW.json
            GradualBlur-TS-CSS.json
            GradualBlur-TS-TW.json
            Grainient-JS-CSS.json
            Grainient-JS-TW.json
            Grainient-TS-CSS.json
            Grainient-TS-TW.json
            GridDistortion-JS-CSS.json
            GridDistortion-JS-TW.json
            GridDistortion-TS-CSS.json
            GridDistortion-TS-TW.json
            GridMotion-JS-CSS.json
            GridMotion-JS-TW.json
            GridMotion-TS-CSS.json
            GridMotion-TS-TW.json
            GridScan-JS-CSS.json
            GridScan-JS-TW.json
            GridScan-TS-CSS.json
            GridScan-TS-TW.json
            Hyperspeed-JS-CSS.json
            Hyperspeed-JS-TW.json
            Hyperspeed-TS-CSS.json
            Hyperspeed-TS-TW.json
            ImageTrail-JS-CSS.json
            ImageTrail-JS-TW.json
            ImageTrail-TS-CSS.json
            ImageTrail-TS-TW.json
            InfiniteMenu-JS-CSS.json
            InfiniteMenu-JS-TW.json
            InfiniteMenu-TS-CSS.json
            InfiniteMenu-TS-TW.json
            Iridescence-JS-CSS.json
            Iridescence-JS-TW.json
            Iridescence-TS-CSS.json
            Iridescence-TS-TW.json
            Lanyard-JS-CSS.json
            Lanyard-JS-TW.json
            Lanyard-TS-CSS.json
            Lanyard-TS-TW.json
            LaserFlow-JS-CSS.json
            LaserFlow-JS-TW.json
            LaserFlow-TS-CSS.json
            LaserFlow-TS-TW.json
            LetterGlitch-JS-CSS.json
            LetterGlitch-JS-TW.json
            LetterGlitch-TS-CSS.json
            LetterGlitch-TS-TW.json
            Lightfall-JS-CSS.json
            Lightfall-JS-TW.json
            Lightfall-TS-CSS.json
            Lightfall-TS-TW.json
            Lightning-JS-CSS.json
            Lightning-JS-TW.json
            Lightning-TS-CSS.json
            Lightning-TS-TW.json
            LightPillar-JS-CSS.json
            LightPillar-JS-TW.json
            LightPillar-TS-CSS.json
            LightPillar-TS-TW.json
            LightRays-JS-CSS.json
            LightRays-JS-TW.json
            LightRays-TS-CSS.json
            LightRays-TS-TW.json
            LineWaves-JS-CSS.json
            LineWaves-JS-TW.json
            LineWaves-TS-CSS.json
            LineWaves-TS-TW.json
            LiquidChrome-JS-CSS.json
            LiquidChrome-JS-TW.json
            LiquidChrome-TS-CSS.json
            LiquidChrome-TS-TW.json
            LiquidEther-JS-CSS.json
            LiquidEther-JS-TW.json
            LiquidEther-TS-CSS.json
            LiquidEther-TS-TW.json
            LogoLoop-JS-CSS.json
            LogoLoop-JS-TW.json
            LogoLoop-TS-CSS.json
            LogoLoop-TS-TW.json
            MagicBento-JS-CSS.json
            MagicBento-JS-TW.json
            MagicBento-TS-CSS.json
            MagicBento-TS-TW.json
            MagicRings-JS-CSS.json
            MagicRings-JS-TW.json
            MagicRings-TS-CSS.json
            MagicRings-TS-TW.json
            Magnet-JS-CSS.json
            Magnet-JS-TW.json
            Magnet-TS-CSS.json
            Magnet-TS-TW.json
            MagnetLines-JS-CSS.json
            MagnetLines-JS-TW.json
            MagnetLines-TS-CSS.json
            MagnetLines-TS-TW.json
            Masonry-JS-CSS.json
            Masonry-JS-TW.json
            Masonry-TS-CSS.json
            Masonry-TS-TW.json
            MetaBalls-JS-CSS.json
            MetaBalls-JS-TW.json
            MetaBalls-TS-CSS.json
            MetaBalls-TS-TW.json
            MetallicPaint-JS-CSS.json
            MetallicPaint-JS-TW.json
            MetallicPaint-TS-CSS.json
            MetallicPaint-TS-TW.json
            ModelViewer-JS-CSS.json
            ModelViewer-JS-TW.json
            ModelViewer-TS-CSS.json
            ModelViewer-TS-TW.json
            Noise-JS-CSS.json
            Noise-JS-TW.json
            Noise-TS-CSS.json
            Noise-TS-TW.json
            Orb-JS-CSS.json
            Orb-JS-TW.json
            Orb-TS-CSS.json
            Orb-TS-TW.json
            OrbitImages-JS-CSS.json
            OrbitImages-JS-TW.json
            OrbitImages-TS-CSS.json
            OrbitImages-TS-TW.json
            Particles-JS-CSS.json
            Particles-JS-TW.json
            Particles-TS-CSS.json
            Particles-TS-TW.json
            PillNav-JS-CSS.json
            PillNav-JS-TW.json
            PillNav-TS-CSS.json
            PillNav-TS-TW.json
            PixelBlast-JS-CSS.json
            PixelBlast-JS-TW.json
            PixelBlast-TS-CSS.json
            PixelBlast-TS-TW.json
            PixelCard-JS-CSS.json
            PixelCard-JS-TW.json
            PixelCard-TS-CSS.json
            PixelCard-TS-TW.json
            PixelSnow-JS-CSS.json
            PixelSnow-JS-TW.json
            PixelSnow-TS-CSS.json
            PixelSnow-TS-TW.json
            PixelTrail-JS-CSS.json
            PixelTrail-JS-TW.json
            PixelTrail-TS-CSS.json
            PixelTrail-TS-TW.json
            PixelTransition-JS-CSS.json
            PixelTransition-JS-TW.json
            PixelTransition-TS-CSS.json
            PixelTransition-TS-TW.json
            Plasma-JS-CSS.json
            Plasma-JS-TW.json
            Plasma-TS-CSS.json
            Plasma-TS-TW.json
            PlasmaWave-JS-CSS.json
            PlasmaWave-JS-TW.json
            PlasmaWave-TS-CSS.json
            PlasmaWave-TS-TW.json
            Prism-JS-CSS.json
            Prism-JS-TW.json
            Prism-TS-CSS.json
            Prism-TS-TW.json
            PrismaticBurst-JS-CSS.json
            PrismaticBurst-JS-TW.json
            PrismaticBurst-TS-CSS.json
            PrismaticBurst-TS-TW.json
            ProfileCard-JS-CSS.json
            ProfileCard-JS-TW.json
            ProfileCard-TS-CSS.json
            ProfileCard-TS-TW.json
            Radar-JS-CSS.json
            Radar-JS-TW.json
            Radar-TS-CSS.json
            Radar-TS-TW.json
            ReflectiveCard-JS-CSS.json
            ReflectiveCard-JS-TW.json
            ReflectiveCard-TS-CSS.json
            ReflectiveCard-TS-TW.json
            registry.json
            Ribbons-JS-CSS.json
            Ribbons-JS-TW.json
            Ribbons-TS-CSS.json
            Ribbons-TS-TW.json
            RippleGrid-JS-CSS.json
            RippleGrid-JS-TW.json
            RippleGrid-TS-CSS.json
            RippleGrid-TS-TW.json
            RotatingText-JS-CSS.json
            RotatingText-JS-TW.json
            RotatingText-TS-CSS.json
            RotatingText-TS-TW.json
            ScrambledText-JS-CSS.json
            ScrambledText-JS-TW.json
            ScrambledText-TS-CSS.json
            ScrambledText-TS-TW.json
            ScrollFloat-JS-CSS.json
            ScrollFloat-JS-TW.json
            ScrollFloat-TS-CSS.json
            ScrollFloat-TS-TW.json
            ScrollReveal-JS-CSS.json
            ScrollReveal-JS-TW.json
            ScrollReveal-TS-CSS.json
            ScrollReveal-TS-TW.json
            ScrollStack-JS-CSS.json
            ScrollStack-JS-TW.json
            ScrollStack-TS-CSS.json
            ScrollStack-TS-TW.json
            ScrollVelocity-JS-CSS.json
            ScrollVelocity-JS-TW.json
            ScrollVelocity-TS-CSS.json
            ScrollVelocity-TS-TW.json
            ShapeBlur-JS-CSS.json
            ShapeBlur-JS-TW.json
            ShapeBlur-TS-CSS.json
            ShapeBlur-TS-TW.json
            ShapeGrid-JS-CSS.json
            ShapeGrid-JS-TW.json
            ShapeGrid-TS-CSS.json
            ShapeGrid-TS-TW.json
            ShinyText-JS-CSS.json
            ShinyText-JS-TW.json
            ShinyText-TS-CSS.json
            ShinyText-TS-TW.json
            Shuffle-JS-CSS.json
            Shuffle-JS-TW.json
            Shuffle-TS-CSS.json
            Shuffle-TS-TW.json
            SideRays-JS-CSS.json
            SideRays-JS-TW.json
            SideRays-TS-CSS.json
            SideRays-TS-TW.json
            Silk-JS-CSS.json
            Silk-JS-TW.json
            Silk-TS-CSS.json
            Silk-TS-TW.json
            SoftAurora-JS-CSS.json
            SoftAurora-JS-TW.json
            SoftAurora-TS-CSS.json
            SoftAurora-TS-TW.json
            SplashCursor-JS-CSS.json
            SplashCursor-JS-TW.json
            SplashCursor-TS-CSS.json
            SplashCursor-TS-TW.json
            SplitText-JS-CSS.json
            SplitText-JS-TW.json
            SplitText-TS-CSS.json
            SplitText-TS-TW.json
            SpotlightCard-JS-CSS.json
            SpotlightCard-JS-TW.json
            SpotlightCard-TS-CSS.json
            SpotlightCard-TS-TW.json
            Stack-JS-CSS.json
            Stack-JS-TW.json
            Stack-TS-CSS.json
            Stack-TS-TW.json
            StaggeredMenu-JS-CSS.json
            StaggeredMenu-JS-TW.json
            StaggeredMenu-TS-CSS.json
            StaggeredMenu-TS-TW.json
            StarBorder-JS-CSS.json
            StarBorder-JS-TW.json
            StarBorder-TS-CSS.json
            StarBorder-TS-TW.json
            Stepper-JS-CSS.json
            Stepper-JS-TW.json
            Stepper-TS-CSS.json
            Stepper-TS-TW.json
            StickerPeel-JS-CSS.json
            StickerPeel-JS-TW.json
            StickerPeel-TS-CSS.json
            StickerPeel-TS-TW.json
            Strands-JS-CSS.json
            Strands-JS-TW.json
            Strands-TS-CSS.json
            Strands-TS-TW.json
            TargetCursor-JS-CSS.json
            TargetCursor-JS-TW.json
            TargetCursor-TS-CSS.json
            TargetCursor-TS-TW.json
            TextCursor-JS-CSS.json
            TextCursor-JS-TW.json
            TextCursor-TS-CSS.json
            TextCursor-TS-TW.json
            TextPressure-JS-CSS.json
            TextPressure-JS-TW.json
            TextPressure-TS-CSS.json
            TextPressure-TS-TW.json
            TextType-JS-CSS.json
            TextType-JS-TW.json
            TextType-TS-CSS.json
            TextType-TS-TW.json
            Threads-JS-CSS.json
            Threads-JS-TW.json
            Threads-TS-CSS.json
            Threads-TS-TW.json
            TiltedCard-JS-CSS.json
            TiltedCard-JS-TW.json
            TiltedCard-TS-CSS.json
            TiltedCard-TS-TW.json
            TrueFocus-JS-CSS.json
            TrueFocus-JS-TW.json
            TrueFocus-TS-CSS.json
            TrueFocus-TS-TW.json
            VariableProximity-JS-CSS.json
            VariableProximity-JS-TW.json
            VariableProximity-TS-CSS.json
            VariableProximity-TS-TW.json
            Waves-JS-CSS.json
            Waves-JS-TW.json
            Waves-TS-CSS.json
            Waves-TS-TW.json
    scripts/
        generateComponent.js
        generateLlmsText.js
        generateSitemap.js
    src/
        App.jsx
        global.d.ts
        main.jsx
        styles.css
        vite-env.d.ts
        assets/
            common/
            demo/
            icons/
            lanyard/
                card.glb
            logos/
            svg/
        components/
            code/
                CliInstallation.jsx
                CodeExample.jsx
                CodeHighlighter.jsx
                CodeOptions.jsx
                Dependencies.jsx
                IconSelect.jsx
            common/
                BackToTopButton.jsx
                ComponentList.jsx
                ContributionSection.jsx
                ProCard.jsx
                ProCardMobile.css
                ProCardMobile.jsx
                SearchDialog.css
                SearchDialog.jsx
                SimpleMarquee.jsx
                SkeletonLoader.jsx
                SponsorsCard.jsx
                SponsorsCircle.jsx
                SVGComponents.jsx
                TabsFooter.jsx
                TabsLayout.jsx
                AnnouncementBar/
                    AnnouncementBar.css
                    AnnouncementBar.jsx
                    index.js
                AnnouncementModal/
                    AnnouncementModal.css
                    AnnouncementModal.jsx
                GitHub/
                    ContributionSection.jsx
                Misc/
                    Announcement.jsx
                    BackToTopButton.jsx
                    SearchDialog.jsx
                    SkeletonLoader.jsx
                Preview/
                    BackgroundContent.jsx
                    Customize.jsx
                    OpenInStudioButton.jsx
                    PreviewColorPicker.jsx
                    PreviewColorPickerCustom.jsx
                    PreviewInput.jsx
                    PreviewSelect.jsx
                    PreviewSlider.jsx
                    PreviewSliderVertical.jsx
                    PreviewSwitch.jsx
                    PropTable.css
                    PropTable.jsx
                    RefreshButton.jsx
                    ResetPropsButton.jsx
            context/
                ComponentPropsContext.jsx
                ActiveRouteContext/
                    ActiveRouteContext.jsx
                InstallationContext/
                    InstallationContext.jsx
                OptionsContext/
                    OptionsContext.jsx
                    useOptions.js
                SearchContext/
                    SearchContext.jsx
                    useSearch.js
                TransitionContext/
                    TransitionContext.jsx
            landingnew/
                CTA/
                    CTA.css
                    CTA.jsx
                Features/
                    Features.css
                    Features.jsx
                Footer/
                    Footer.css
                    Footer.jsx
                Hero/
                    DotField.jsx
                    Hero.css
                    Hero.jsx
                    HeroBand.jsx
                LandingLoader/
                    LandingLoader.css
                    LandingLoader.jsx
                LiveDemo/
                    LiveDemo.css
                    LiveDemo.jsx
                Navbar/
                    Navbar.css
                    Navbar.jsx
                QuickStart/
                    QuickStart.css
                    QuickStart.jsx
                Sponsors/
                    Sponsors.css
                    Sponsors.jsx
                Testimonials/
                    Testimonials.css
                    Testimonials.jsx
            layout/
                Providers.jsx
                SidebarLayout.jsx
            navs/
                Header.jsx
                Sidebar.jsx
            setup/
                color-mode.jsx
                provider.jsx
                toaster.jsx
                tooltip.jsx
        constants/
            Categories.js
            colors.js
            Components.js
            Information.js
            Showcase.js
            Site.js
            Sponsors.js
            Tools.js
            code/
                Animations/
                    animatedContentCode.js
                    antigravityCode.js
                    blobCursorCode.js
                    clickSparkCode.js
                    crosshairCode.js
                    cubesCode.js
                    electricBorderCode.js
                    fadeContentCode.js
                    ghostCursorCode.js
                    glareHoverCode.js
                    gradualblurCode.js
                    imageTrailCode.js
                    laserFlowCode.js
                    logoLoopCode.js
                    magicRingsCode.js
                    magnetCode.js
                    magnetLinesCode.js
                    metaBallsCode.js
                    metallicPaintCode.js
                    noiseCode.js
                    orbitImagesCode.js
                    pixelTrailCode.js
                    pixelTransitionCode.js
                    ribbonsCode.js
                    shapeBlurCode.js
                    splashCursorCode.js
                    starBorderCode.js
                    stickerPeelCode.js
                    strandsCode.js
                    targetCursorCode.js
                Backgrounds/
                    auroraCode.js
                    balatroCode.js
                    ballpitCode.js
                    beamsCode.js
                    colorBendsCode.js
                    darkVeilCode.js
                    ditherCode.js
                    dotFieldCode.js
                    dotGridCode.js
                    evilEyeCode.js
                    faultyTerminalCode.js
                    ferrofluidCode.js
                    floatingLinesCode.js
                    galaxyCode.js
                    gradientBlindsCode.js
                    grainientCode.js
                    gridDistortionCode.js
                    gridMotionCode.js
                    gridScanCode.js
                    hyperspeedCode.js
                    iridescenceCode.js
                    letterGlitchCode.js
                    lightfallCode.js
                    lightningCode.js
                    lightPillarCode.js
                    lightRaysCode.js
                    lineWavesCode.js
                    liquidChromeCode.js
                    liquidEtherCode.js
                    orbCode.js
                    particlesCode.js
                    pixelBlastCode.js
                    pixelSnowCode.js
                    plasmaCode.js
                    plasmaWaveCode.js
                    prismaticBurstCode.js
                    prismCode.js
                    radarCode.js
                    rippleGridCode.js
                    shapeGridCode.js
                    sideRaysCode.js
                    silkCode.js
                    softAuroraCode.js
                    threadsCode.js
                    wavesCode.js
                Components/
                    animatedListCode.js
                    borderGlowCode.js
                    bounceCardsCode.js
                    bubbleMenuCode.js
                    cardNavCode.js
                    cardSwapCode.js
                    carouselCode.js
                    chromaGridCode.js
                    circularGalleryCode.js
                    counterCode.js
                    decayCardCode.js
                    dockCode.js
                    domeGalleryCode.js
                    elasticSliderCode.js
                    flowingMenuCode.js
                    fluidGlassCode.js
                    flyingPostersCode.js
                    folderCode.js
                    glassIconsCode.js
                    glassSurfaceCode.js
                    gooeyNavCode.js
                    infiniteMenuCode.js
                    lanyardCode.js
                    magicBentoCode.js
                    masonryCode.js
                    modelViewerCode.js
                    pillNavCode.js
                    pixelCardCode.js
                    profileCardCode.js
                    reflectiveCardCode.js
                    scrollStackCode.js
                    spotlightCardCode.js
                    stackCode.js
                    staggeredMenuCode.js
                    stepperCode.js
                    tiltedCardCode.js
                TextAnimations/
                    asciiTextCode.js
                    blurTextCode.js
                    circularTextCode.js
                    countUpCode.js
                    curvedLoopCode.js
                    decryptedTextCode.js
                    fallingTextCode.js
                    fuzzyTextCode.js
                    glitchTextCode.js
                    gradientTextCode.js
                    rotatingTextCode.js
                    scrambledTextCode.js
                    scrollFloatCode.js
                    scrollRevealCode.js
                    scrollVelocityCode.js
                    shinyTextCode.js
                    shuffleCode.js
                    splitTextCode.js
                    textCursorCode.js
                    textPressureCode.js
                    textTypeCode.js
                    trueFocusCode.js
                    variableProximityCode.js
        content/
            Animations/
                AnimatedContent/
                    AnimatedContent.jsx
                Antigravity/
                    Antigravity.jsx
                BlobCursor/
                    BlobCursor.css
                    BlobCursor.jsx
                ClickSpark/
                    ClickSpark.jsx
                Crosshair/
                    Crosshair.jsx
                Cubes/
                    Cubes.css
                    Cubes.jsx
                ElectricBorder/
                    ElectricBorder.css
                    ElectricBorder.jsx
                FadeContent/
                    FadeContent.jsx
                GhostCursor/
                    GhostCursor.css
                    GhostCursor.jsx
                GlareHover/
                    GlareHover.css
                    GlareHover.jsx
                GradualBlur/
                    GradualBlur.css
                    GradualBlur.jsx
                ImageTrail/
                    ImageTrail.css
                    ImageTrail.jsx
                LaserFlow/
                    LaserFlow.css
                    LaserFlow.jsx
                LogoLoop/
                    LogoLoop.css
                    LogoLoop.jsx
                MagicRings/
                    MagicRings.css
                    MagicRings.jsx
                Magnet/
                    Magnet.jsx
                MagnetLines/
                    MagnetLines.css
                    MagnetLines.jsx
                MetaBalls/
                    MetaBalls.css
                    MetaBalls.jsx
                MetallicPaint/
                    MetallicPaint.css
                    MetallicPaint.jsx
                Noise/
                    Noise.css
                    Noise.jsx
                OrbitImages/
                    OrbitImages.css
                    OrbitImages.jsx
                PixelTrail/
                    PixelTrail.css
                    PixelTrail.jsx
                PixelTransition/
                    PixelTransition.css
                    PixelTransition.jsx
                Ribbons/
                    Ribbons.css
                    Ribbons.jsx
                ShapeBlur/
                    ShapeBlur.jsx
                SplashCursor/
                    SplashCursor.jsx
                StarBorder/
                    StarBorder.css
                    StarBorder.jsx
                StickerPeel/
                    StickerPeel.css
                    StickerPeel.jsx
                Strands/
                    Strands.css
                    Strands.jsx
                TargetCursor/
                    TargetCursor.css
                    TargetCursor.jsx
            Backgrounds/
                Aurora/
                    Aurora.css
                    Aurora.jsx
                Balatro/
                    Balatro.css
                    Balatro.jsx
                Ballpit/
                    Ballpit.jsx
                Beams/
                    Beams.css
                    Beams.jsx
                ColorBends/
                    ColorBends.css
                    ColorBends.jsx
                DarkVeil/
                    DarkVeil.css
                    DarkVeil.jsx
                Dither/
                    Dither.css
                    Dither.jsx
                DotField/
                    DotField.css
                    DotField.jsx
                DotGrid/
                    DotGrid.css
                    DotGrid.jsx
                EvilEye/
                    EvilEye.css
                    EvilEye.jsx
                FaultyTerminal/
                    FaultyTerminal.css
                    FaultyTerminal.jsx
                Ferrofluid/
                    Ferrofluid.css
                    Ferrofluid.jsx
                FloatingLines/
                    FloatingLines.css
                    FloatingLines.jsx
                Galaxy/
                    Galaxy.css
                    Galaxy.jsx
                GradientBlinds/
                    GradientBlinds.css
                    GradientBlinds.jsx
                Grainient/
                    Grainient.css
                    Grainient.jsx
                GridDistortion/
                    GridDistortion.css
                    GridDistortion.jsx
                GridMotion/
                    GridMotion.css
                    GridMotion.jsx
                GridScan/
                    GridScan.css
                    GridScan.jsx
                Hyperspeed/
                    Hyperspeed.css
                    Hyperspeed.jsx
                    HyperSpeedPresets.js
                Iridescence/
                    Iridescence.css
                    Iridescence.jsx
                LetterGlitch/
                    LetterGlitch.jsx
                Lightfall/
                    Lightfall.css
                    Lightfall.jsx
                Lightning/
                    Lightning.css
                    Lightning.jsx
                LightPillar/
                    LightPillar.css
                    LightPillar.jsx
                LightRays/
                    LightRays.css
                    LightRays.jsx
                LineWaves/
                    LineWaves.css
                    LineWaves.jsx
                LiquidChrome/
                    LiquidChrome.css
                    LiquidChrome.jsx
                LiquidEther/
                    LiquidEther.css
                    LiquidEther.jsx
                Orb/
                    Orb.css
                    Orb.jsx
                Particles/
                    Particles.css
                    Particles.jsx
                PixelBlast/
                    PixelBlast.css
                    PixelBlast.jsx
                PixelSnow/
                    PixelSnow.css
                    PixelSnow.jsx
                Plasma/
                    Plasma.css
                    Plasma.jsx
                PlasmaWave/
                    PlasmaWave.css
                    PlasmaWave.jsx
                Prism/
                    Prism.css
                    Prism.jsx
                PrismaticBurst/
                    PrismaticBurst.css
                    PrismaticBurst.jsx
                Radar/
                    Radar.css
                    Radar.jsx
                RippleGrid/
                    RippleGrid.css
                    RippleGrid.jsx
                ShapeGrid/
                    ShapeGrid.css
                    ShapeGrid.jsx
                SideRays/
                    SideRays.css
                    SideRays.jsx
                Silk/
                    Silk.jsx
                SoftAurora/
                    SoftAurora.css
                    SoftAurora.jsx
                Threads/
                    Threads.css
                    Threads.jsx
                Waves/
                    Waves.css
                    Waves.jsx
            Components/
                AnimatedList/
                    AnimatedList.css
                    AnimatedList.jsx
                BorderGlow/
                    BorderGlow.css
                    BorderGlow.jsx
                BounceCards/
                    BounceCards.css
                    BounceCards.jsx
                BubbleMenu/
                    BubbleMenu.css
                    BubbleMenu.jsx
                CardNav/
                    CardNav.css
                    CardNav.jsx
                CardSwap/
                    CardSwap.css
                    CardSwap.jsx
                Carousel/
                    Carousel.css
                    Carousel.jsx
                ChromaGrid/
                    ChromaGrid.css
                    ChromaGrid.jsx
                CircularGallery/
                    CircularGallery.css
                    CircularGallery.jsx
                Counter/
                    Counter.css
                    Counter.jsx
                DecayCard/
                    DecayCard.css
                    DecayCard.jsx
                Dock/
                    Dock.css
                    Dock.jsx
                DomeGallery/
                    DomeGallery.css
                    DomeGallery.jsx
                ElasticSlider/
                    ElasticSlider.css
                    ElasticSlider.jsx
                FlowingMenu/
                    FlowingMenu.css
                    FlowingMenu.jsx
                FluidGlass/
                    FluidGlass.jsx
                FlyingPosters/
                    FlyingPosters.css
                    FlyingPosters.jsx
                Folder/
                    Folder.css
                    Folder.jsx
                GlassIcons/
                    GlassIcons.css
                    GlassIcons.jsx
                GlassSurface/
                    GlassSurface.css
                    GlassSurface.jsx
                GooeyNav/
                    GooeyNav.css
                    GooeyNav.jsx
                InfiniteMenu/
                    InfiniteMenu.css
                    InfiniteMenu.jsx
                Lanyard/
                    card.glb
                    Lanyard.css
                    Lanyard.jsx
                MagicBento/
                    MagicBento.css
                    MagicBento.jsx
                Masonry/
                    Masonry.css
                    Masonry.jsx
                ModelViewer/
                    ModelViewer.jsx
                PillNav/
                    PillNav.css
                    PillNav.jsx
                PixelCard/
                    PixelCard.css
                    PixelCard.jsx
                ProfileCard/
                    ProfileCard.css
                    ProfileCard.jsx
                ReflectiveCard/
                    ReflectiveCard.css
                    ReflectiveCard.jsx
                ScrollStack/
                    ScrollStack.css
                    ScrollStack.jsx
                SpotlightCard/
                    SpotlightCard.css
                    SpotlightCard.jsx
                Stack/
                    Stack.css
                    Stack.jsx
                StaggeredMenu/
                    StaggeredMenu.css
                    StaggeredMenu.jsx
                Stepper/
                    Stepper.css
                    Stepper.jsx
                TiltedCard/
                    TiltedCard.css
                    TiltedCard.jsx
            TextAnimations/
                ASCIIText/
                    ASCIIText.jsx
                BlurText/
                    BlurText.jsx
                CircularText/
                    CircularText.css
                    CircularText.jsx
                CountUp/
                    CountUp.jsx
                CurvedLoop/
                    CurvedLoop.css
                    CurvedLoop.jsx
                DecryptedText/
                    DecryptedText.jsx
                FallingText/
                    FallingText.css
                    FallingText.jsx
                FuzzyText/
                    FuzzyText.jsx
                GlitchText/
                    GlitchText.css
                    GlitchText.jsx
                GradientText/
                    GradientText.css
                    GradientText.jsx
                RotatingText/
                    RotatingText.css
                    RotatingText.jsx
                ScrambledText/
                    ScrambledText.css
                    ScrambledText.jsx
                ScrollFloat/
                    ScrollFloat.css
                    ScrollFloat.jsx
                ScrollReveal/
                    ScrollReveal.css
                    ScrollReveal.jsx
                ScrollVelocity/
                    ScrollVelocity.css
                    ScrollVelocity.jsx
                ShinyText/
                    ShinyText.css
                    ShinyText.jsx
                Shuffle/
                    Shuffle.css
                    Shuffle.jsx
                SplitText/
                    SplitText.jsx
                TextCursor/
                    TextCursor.css
                    TextCursor.jsx
                TextPressure/
                    TextPressure.jsx
                TextType/
                    TextType.css
                    TextType.jsx
                TrueFocus/
                    TrueFocus.css
                    TrueFocus.jsx
                VariableProximity/
                    VariableProximity.css
                    VariableProximity.jsx
        css/
            category.css
            docs.css
            fonts.css
            landing.css
            misc.css
            preview-slider.css
            showcase.css
            sidebar.css
            skeleton.css
            sponsors-page.css
            tools-landing.css
            transitions.css
            variables.css
        demo/
            Animations/
                AnimatedContentDemo.jsx
                AntigravityDemo.jsx
                BlobCursorDemo.jsx
                ClickSparkDemo.jsx
                CrosshairDemo.jsx
                CubesDemo.jsx
                ElectricBorderDemo.jsx
                FadeContentDemo.jsx
                GhostCursorDemo.jsx
                GlareHoverDemo.jsx
                GradualBlurDemo.jsx
                ImageTrailDemo.jsx
                LaserFlowDemo.jsx
                LogoLoopDemo.jsx
                MagicRingsDemo.jsx
                MagnetDemo.jsx
                MagnetLinesDemo.jsx
                MetaBallsDemo.jsx
                MetallicPaintDemo.jsx
                NoiseDemo.jsx
                OrbitImagesDemo.jsx
                PixelTrailDemo.jsx
                PixelTransitionDemo.jsx
                RibbonsDemo.jsx
                ShapeBlurDemo.jsx
                SplashCursorDemo.jsx
                StarBorderDemo.jsx
                StickerPeelDemo.jsx
                StrandsDemo.jsx
                TargetCursorDemo.jsx
            Backgrounds/
                AuroraDemo.jsx
                BalatroDemo.jsx
                BallpitDemo.jsx
                BeamsDemo.jsx
                ColorBendsDemo.jsx
                DarkVeilDemo.jsx
                DitherDemo.jsx
                DotFieldDemo.jsx
                DotGridDemo.jsx
                EvilEyeDemo.jsx
                FaultyTerminalDemo.jsx
                FerrofluidDemo.jsx
                FloatingLinesDemo.jsx
                GalaxyDemo.jsx
                GradientBlindsDemo.jsx
                GrainientDemo.jsx
                GridDistortionDemo.jsx
                GridMotionDemo.jsx
                GridScanDemo.jsx
                HyperspeedDemo.jsx
                IridescenceDemo.jsx
                LetterGlitchDemo.jsx
                LightfallDemo.jsx
                LightningDemo.jsx
                LightPillarDemo.jsx
                LightRaysDemo.jsx
                LineWavesDemo.jsx
                LiquidChromeDemo.jsx
                LiquidEtherDemo.jsx
                OrbDemo.jsx
                ParticlesDemo.jsx
                PixelBlastDemo.jsx
                PixelSnowDemo.jsx
                PlasmaDemo.jsx
                PlasmaWaveDemo.jsx
                PrismaticBurstDemo.jsx
                PrismDemo.jsx
                RadarDemo.jsx
                RippleGridDemo.jsx
                ShapeGridDemo.jsx
                SideRaysDemo.jsx
                SilkDemo.jsx
                SoftAuroraDemo.jsx
                ThreadsDemo.jsx
                WavesDemo.jsx
            Components/
                AnimatedListDemo.jsx
                BorderGlowDemo.jsx
                BounceCardsDemo.jsx
                BubbleMenuDemo.jsx
                CardNavDemo.jsx
                CardSwapDemo.jsx
                CarouselDemo.jsx
                ChromaGridDemo.jsx
                CircularGalleryDemo.jsx
                CounterDemo.jsx
                DecayCardDemo.jsx
                DockDemo.jsx
                DomeGalleryDemo.jsx
                ElasticSliderDemo.jsx
                FlowingMenuDemo.jsx
                FluidGlassDemo.jsx
                FlyingPostersDemo.jsx
                FolderDemo.jsx
                GlassIconsDemo.jsx
                GlassSurfaceDemo.jsx
                GooeyNavDemo.jsx
                InfiniteMenuDemo.jsx
                LanyardDemo.jsx
                MagicBentoDemo.jsx
                MasonryDemo.jsx
                ModelViewerDemo.jsx
                PillNavDemo.jsx
                PixelCardDemo.jsx
                ProfileCardDemo.jsx
                ReflectiveCardDemo.jsx
                ScrollStackDemo.jsx
                SpotlightCardDemo.jsx
                StackDemo.jsx
                StaggeredMenuDemo.jsx
                StepperDemo.jsx
                TiltedCardDemo.jsx
            TextAnimations/
                ASCIITextDemo.jsx
                BlurTextDemo.jsx
                CircularTextDemo.jsx
                CountUpDemo.jsx
                CurvedLoopDemo.jsx
                DecryptedTextDemo.jsx
                FallingTextDemo.jsx
                FuzzyTextDemo.jsx
                GlitchTextDemo.jsx
                GradientTextDemo.jsx
                RotatingTextDemo.jsx
                ScrambledTextDemo.jsx
                ScrollFloatDemo.jsx
                ScrollRevealDemo.jsx
                ScrollVelocityDemo.jsx
                ShinyTextDemo.jsx
                ShuffleDemo.jsx
                SplitTextDemo.jsx
                TextCursorDemo.jsx
                TextPressureDemo.jsx
                TextTypeDemo.jsx
                TrueFocusDemo.jsx
                VariableProximityDemo.jsx
        docs/
            CodeBlock.jsx
            DocsButtonBar.jsx
            Installation.jsx
            Introduction.jsx
            McpServer.jsx
            MethodSelector.jsx
        hooks/
            useActiveRoute.js
            useComponentProps.js
            useComponentPropsContext.js
            useForceRerender.js
            useInstallation.js
            useScrollToTop.js
            useStars.js
            useTransition.js
        pages/
            CategoryPage.jsx
            FavoritesPage.jsx
            IndexPage.jsx
            LandingPage.jsx
            ShowcasePage.jsx
            SponsorsPage.jsx
            ToolsPage.jsx
        tailwind/
            Animations/
                AnimatedContent/
                    AnimatedContent.jsx
                Antigravity/
                    Antigravity.jsx
                BlobCursor/
                    BlobCursor.jsx
                ClickSpark/
                    ClickSpark.jsx
                Crosshair/
                    Crosshair.jsx
                Cubes/
                    Cubes.jsx
                ElectricBorder/
                    ElectricBorder.jsx
                FadeContent/
                    FadeContent.jsx
                GhostCursor/
                    GhostCursor.jsx
                GlareHover/
                    GlareHover.jsx
                GradualBlur/
                    GradualBlur.jsx
                ImageTrail/
                    ImageTrail.jsx
                LaserFlow/
                    LaserFlow.jsx
                LogoLoop/
                    LogoLoop.jsx
                MagicRings/
                    MagicRings.jsx
                Magnet/
                    Magnet.jsx
                MagnetLines/
                    MagnetLines.jsx
                MetaBalls/
                    MetaBalls.jsx
                MetallicPaint/
                    MetallicPaint.jsx
                Noise/
                    Noise.jsx
                OrbitImages/
                    OrbitImages.jsx
                PixelTrail/
                    PixelTrail.jsx
                PixelTransition/
                    PixelTransition.jsx
                Ribbons/
                    Ribbons.jsx
                ShapeBlur/
                    ShapeBlur.jsx
                SplashCursor/
                    SplashCursor.jsx
                StarBorder/
                    StarBorder.jsx
                StickerPeel/
                    StickerPeel.jsx
                Strands/
                    Strands.jsx
                TargetCursor/
                    TargetCursor.jsx
            Backgrounds/
                Aurora/
                    Aurora.jsx
                Balatro/
                    Balatro.jsx
                Ballpit/
                    Ballpit.jsx
                Beams/
                    Beams.jsx
                ColorBends/
                    ColorBends.jsx
                DarkVeil/
                    DarkVeil.jsx
                Dither/
                    Dither.jsx
                DotField/
                    DotField.jsx
                DotGrid/
                    DotGrid.jsx
                EvilEye/
                    EvilEye.jsx
                FaultyTerminal/
                    FaultyTerminal.jsx
                Ferrofluid/
                    Ferrofluid.jsx
                FloatingLines/
                    FloatingLines.jsx
                Galaxy/
                    Galaxy.jsx
                GradientBlinds/
                    GradientBlinds.jsx
                Grainient/
                    Grainient.jsx
                GridDistortion/
                    GridDistortion.jsx
                GridMotion/
                    GridMotion.jsx
                GridScan/
                    GridScan.jsx
                Hyperspeed/
                    Hyperspeed.jsx
                    HyperSpeedPresets.js
                Iridescence/
                    Iridescence.jsx
                LetterGlitch/
                    LetterGlitch.jsx
                Lightfall/
                    Lightfall.jsx
                Lightning/
                    Lightning.jsx
                LightPillar/
                    LightPillar.jsx
                LightRays/
                    LightRays.jsx
                LineWaves/
                    LineWaves.jsx
                LiquidChrome/
                    LiquidChrome.jsx
                LiquidEther/
                    LiquidEther.jsx
                Orb/
                    Orb.jsx
                Particles/
                    Particles.jsx
                PixelBlast/
                    PixelBlast.jsx
                PixelSnow/
                    PixelSnow.jsx
                Plasma/
                    Plasma.jsx
                PlasmaWave/
                    PlasmaWave.jsx
                Prism/
                    Prism.jsx
                PrismaticBurst/
                    PrismaticBurst.jsx
                Radar/
                    Radar.jsx
                RippleGrid/
                    RippleGrid.jsx
                ShapeGrid/
                    ShapeGrid.jsx
                SideRays/
                    SideRays.jsx
                Silk/
                    Silk.jsx
                SoftAurora/
                    SoftAurora.jsx
                Threads/
                    Threads.jsx
                Waves/
                    Waves.jsx
            Components/
                AnimatedList/
                    AnimatedList.jsx
                BorderGlow/
                    BorderGlow.jsx
                BounceCards/
                    BounceCards.jsx
                BubbleMenu/
                    BubbleMenu.jsx
                CardNav/
                    CardNav.jsx
                CardSwap/
                    CardSwap.jsx
                Carousel/
                    Carousel.jsx
                ChromaGrid/
                    ChromaGrid.jsx
                CircularGallery/
                    CircularGallery.jsx
                Counter/
                    Counter.jsx
                DecayCard/
                    DecayCard.jsx
                Dock/
                    Dock.jsx
                DomeGallery/
                    DomeGallery.jsx
                ElasticSlider/
                    ElasticSlider.jsx
                FlowingMenu/
                    FlowingMenu.jsx
                FluidGlass/
                    FluidGlass.jsx
                FlyingPosters/
                    FlyingPosters.jsx
                Folder/
                    Folder.jsx
                GlassIcons/
                    GlassIcons.jsx
                GlassSurface/
                    GlassSurface.jsx
                GooeyNav/
                    GooeyNav.jsx
                InfiniteMenu/
                    InfiniteMenu.jsx
                Lanyard/
                    card.glb
                    Lanyard.jsx
                MagicBento/
                    MagicBento.jsx
                Masonry/
                    Masonry.jsx
                ModelViewer/
                    ModelViewer.jsx
                PillNav/
                    PillNav.jsx
                PixelCard/
                    PixelCard.jsx
                ProfileCard/
                    ProfileCard.jsx
                ReflectiveCard/
                    ReflectiveCard.jsx
                ScrollStack/
                    ScrollStack.jsx
                SpotlightCard/
                    SpotlightCard.jsx
                Stack/
                    Stack.jsx
                StaggeredMenu/
                    StaggeredMenu.jsx
                Stepper/
                    Stepper.jsx
                TiltedCard/
                    TiltedCard.jsx
            TextAnimations/
                ASCIIText/
                    ASCIIText.jsx
                BlurText/
                    BlurText.jsx
                CircularText/
                    CircularText.jsx
                CountUp/
                    CountUp.jsx
                CurvedLoop/
                    CurvedLoop.jsx
                DecryptedText/
                    DecryptedText.jsx
                FallingText/
                    FallingText.jsx
                FuzzyText/
                    FuzzyText.jsx
                GlitchText/
                    GlitchText.jsx
                GradientText/
                    GradientText.jsx
                RotatingText/
                    RotatingText.jsx
                ScrambledText/
                    ScrambledText.jsx
                ScrollFloat/
                    ScrollFloat.jsx
                ScrollReveal/
                    ScrollReveal.jsx
                ScrollVelocity/
                    ScrollVelocity.jsx
                ShinyText/
                    ShinyText.jsx
                Shuffle/
                    Shuffle.jsx
                SplitText/
                    SplitText.jsx
                TextCursor/
                    TextCursor.jsx
                TextPressure/
                    TextPressure.jsx
                TextType/
                    TextType.jsx
                TrueFocus/
                    TrueFocus.jsx
                VariableProximity/
                    VariableProximity.jsx
        tools/
            tools.css
            background-studio/
                BackgroundStudio.jsx
                Controls.jsx
                backgrounds/
                    index.js
                hooks/
                    useBackgroundState.js
                utils/
                    exportCode.js
            shape-magic/
                Canvas.jsx
                computeBridges.js
                Controls.jsx
                ShapeMagic.jsx
                svgRenderers.js
                types.js
            texture-lab/
                Canvas.jsx
                Controls.jsx
                renderer.js
                shaders.js
                TextureLab.jsx
                types.js
                utils.js
        ts-default/
            Animations/
                AnimatedContent/
                    AnimatedContent.tsx
                Antigravity/
                    Antigravity.tsx
                BlobCursor/
                    BlobCursor.css
                    BlobCursor.tsx
                ClickSpark/
                    ClickSpark.tsx
                Crosshair/
                    Crosshair.tsx
                Cubes/
                    Cubes.css
                    Cubes.tsx
                ElectricBorder/
                    ElectricBorder.css
                    ElectricBorder.tsx
                FadeContent/
                    FadeContent.tsx
                GhostCursor/
                    GhostCursor.css
                    GhostCursor.tsx
                GlareHover/
                    GlareHover.css
                    GlareHover.tsx
                GradualBlur/
                    GradualBlur.css
                    GradualBlur.tsx
                ImageTrail/
                    ImageTrail.css
                    ImageTrail.tsx
                LaserFlow/
                    LaserFlow.css
                    LaserFlow.tsx
                LogoLoop/
                    LogoLoop.css
                    LogoLoop.tsx
                MagicRings/
                    MagicRings.css
                    MagicRings.tsx
                Magnet/
                    Magnet.tsx
                MagnetLines/
                    MagnetLines.css
                    MagnetLines.tsx
                MetaBalls/
                    MetaBalls.css
                    MetaBalls.tsx
                MetallicPaint/
                    MetallicPaint.css
                    MetallicPaint.tsx
                Noise/
                    Noise.css
                    Noise.tsx
                OrbitImages/
                    OrbitImages.css
                    OrbitImages.tsx
                PixelTrail/
                    PixelTrail.css
                    PixelTrail.tsx
                PixelTransition/
                    PixelTransition.css
                    PixelTransition.tsx
                Ribbons/
                    Ribbons.css
                    Ribbons.tsx
                ShapeBlur/
                    ShapeBlur.tsx
                SplashCursor/
                    SplashCursor.tsx
                StarBorder/
                    StarBorder.css
                    StarBorder.tsx
                StickerPeel/
                    StickerPeel.css
                    StickerPeel.tsx
                Strands/
                    Strands.css
                    Strands.tsx
                TargetCursor/
                    TargetCursor.css
                    TargetCursor.tsx
            Backgrounds/
                Aurora/
                    Aurora.css
                    Aurora.tsx
                Balatro/
                    Balatro.css
                    Balatro.tsx
                Ballpit/
                    Ballpit.tsx
                Beams/
                    Beams.css
                    Beams.tsx
                ColorBends/
                    ColorBends.css
                    ColorBends.tsx
                DarkVeil/
                    DarkVeil.css
                    DarkVeil.tsx
                Dither/
                    Dither.css
                    Dither.tsx
                DotField/
                    DotField.css
                    DotField.tsx
                DotGrid/
                    DotGrid.css
                    DotGrid.tsx
                EvilEye/
                    EvilEye.css
                    EvilEye.tsx
                FaultyTerminal/
                    FaultyTerminal.css
                    FaultyTerminal.tsx
                Ferrofluid/
                    Ferrofluid.css
                    Ferrofluid.tsx
                FloatingLines/
                    FloatingLines.css
                    FloatingLines.tsx
                Galaxy/
                    Galaxy.css
                    Galaxy.tsx
                GradientBlinds/
                    GradientBlinds.css
                    GradientBlinds.tsx
                Grainient/
                    Grainient.css
                    Grainient.tsx
                GridDistortion/
                    GridDistortion.css
                    GridDistortion.tsx
                GridMotion/
                    GridMotion.css
                    GridMotion.tsx
                GridScan/
                    GridScan.css
                    GridScan.tsx
                Hyperspeed/
                    Hyperspeed.css
                    Hyperspeed.tsx
                    HyperSpeedPresets.ts
                Iridescence/
                    Iridescence.css
                    Iridescence.tsx
                LetterGlitch/
                    LetterGlitch.tsx
                Lightfall/
                    Lightfall.css
                    Lightfall.tsx
                Lightning/
                    Lightning.css
                    Lightning.tsx
                LightPillar/
                    LightPillar.css
                    LightPillar.tsx
                LightRays/
                    LightRays.css
                    LightRays.tsx
                LineWaves/
                    LineWaves.css
                    LineWaves.tsx
                LiquidChrome/
                    LiquidChrome.css
                    LiquidChrome.tsx
                LiquidEther/
                    LiquidEther.css
                    LiquidEther.tsx
                Orb/
                    Orb.css
                    Orb.tsx
                Particles/
                    Particles.css
                    Particles.tsx
                PixelBlast/
                    PixelBlast.css
                    PixelBlast.tsx
                PixelSnow/
                    PixelSnow.css
                    PixelSnow.tsx
                Plasma/
                    Plasma.css
                    Plasma.tsx
                PlasmaWave/
                    PlasmaWave.css
                    PlasmaWave.tsx
                Prism/
                    Prism.css
                    Prism.tsx
                PrismaticBurst/
                    PrismaticBurst.css
                    PrismaticBurst.tsx
                Radar/
                    Radar.css
                    Radar.tsx
                RippleGrid/
                    RippleGrid.css
                    RippleGrid.tsx
                ShapeGrid/
                    ShapeGrid.css
                    ShapeGrid.tsx
                SideRays/
                    SideRays.css
                    SideRays.tsx
                Silk/
                    Silk.tsx
                SoftAurora/
                    SoftAurora.css
                    SoftAurora.tsx
                Threads/
                    Threads.css
                    Threads.tsx
                Waves/
                    Waves.css
                    Waves.tsx
            Components/
                AnimatedList/
                    AnimatedList.css
                    AnimatedList.tsx
                BorderGlow/
                    BorderGlow.css
                    BorderGlow.tsx
                BounceCards/
                    BounceCards.css
                    BounceCards.tsx
                BubbleMenu/
                    BubbleMenu.css
                    BubbleMenu.tsx
                CardNav/
                    CardNav.css
                    CardNav.tsx
                CardSwap/
                    CardSwap.css
                    CardSwap.tsx
                Carousel/
                    Carousel.css
                    Carousel.tsx
                ChromaGrid/
                    ChromaGrid.css
                    ChromaGrid.tsx
                CircularGallery/
                    CircularGallery.css
                    CircularGallery.tsx
                Counter/
                    Counter.css
                    Counter.tsx
                DecayCard/
                    DecayCard.css
                    DecayCard.tsx
                Dock/
                    Dock.css
                    Dock.tsx
                DomeGallery/
                    DomeGallery.css
                    DomeGallery.tsx
                ElasticSlider/
                    ElasticSlider.css
                    ElasticSlider.tsx
                FlowingMenu/
                    FlowingMenu.css
                    FlowingMenu.tsx
                FluidGlass/
                    FluidGlass.tsx
                FlyingPosters/
                    FlyingPosters.css
                    FlyingPosters.tsx
                Folder/
                    Folder.css
                    Folder.tsx
                GlassIcons/
                    GlassIcons.css
                    GlassIcons.tsx
                GlassSurface/
                    GlassSurface.css
                    GlassSurface.tsx
                GooeyNav/
                    GooeyNav.css
                    GooeyNav.tsx
                InfiniteMenu/
                    InfiniteMenu.css
                    InfiniteMenu.tsx
                Lanyard/
                    card.glb
                    Lanyard.css
                    Lanyard.tsx
                MagicBento/
                    MagicBento.css
                    MagicBento.tsx
                Masonry/
                    Masonry.css
                    Masonry.tsx
                ModelViewer/
                    ModelViewer.tsx
                PillNav/
                    PillNav.css
                    PillNav.tsx
                PixelCard/
                    PixelCard.css
                    PixelCard.tsx
                ProfileCard/
                    ProfileCard.css
                    ProfileCard.tsx
                ReflectiveCard/
                    ReflectiveCard.css
                    ReflectiveCard.tsx
                ScrollStack/
                    ScrollStack.css
                    ScrollStack.tsx
                SpotlightCard/
                    SpotlightCard.css
                    SpotlightCard.tsx
                Stack/
                    Stack.css
                    Stack.tsx
                StaggeredMenu/
                    StaggeredMenu.css
                    StaggeredMenu.tsx
                Stepper/
                    Stepper.css
                    Stepper.tsx
                TiltedCard/
                    TiltedCard.css
                    TiltedCard.tsx
            TextAnimations/
                ASCIIText/
                    ASCIIText.tsx
                BlurText/
                    BlurText.tsx
                CircularText/
                    CircularText.css
                    CircularText.tsx
                CountUp/
                    CountUp.tsx
                CurvedLoop/
                    CurvedLoop.css
                    CurvedLoop.tsx
                DecryptedText/
                    DecryptedText.tsx
                FallingText/
                    FallingText.css
                    FallingText.tsx
                FuzzyText/
                    FuzzyText.tsx
                GlitchText/
                    GlitchText.css
                    GlitchText.tsx
                GradientText/
                    GradientText.css
                    GradientText.tsx
                RotatingText/
                    RotatingText.css
                    RotatingText.tsx
                ScrambledText/
                    ScrambledText.css
                    ScrambledText.tsx
                ScrollFloat/
                    ScrollFloat.css
                    ScrollFloat.tsx
                ScrollReveal/
                    ScrollReveal.css
                    ScrollReveal.tsx
                ScrollVelocity/
                    ScrollVelocity.css
                    ScrollVelocity.tsx
                ShinyText/
                    ShinyText.css
                    ShinyText.tsx
                Shuffle/
                    Shuffle.css
                    Shuffle.tsx
                SplitText/
                    SplitText.tsx
                TextCursor/
                    TextCursor.css
                    TextCursor.tsx
                TextPressure/
                    TextPressure.tsx
                TextType/
                    TextType.css
                    TextType.tsx
                TrueFocus/
                    TrueFocus.css
                    TrueFocus.tsx
                VariableProximity/
                    VariableProximity.css
                    VariableProximity.tsx
        ts-tailwind/
            Animations/
                AnimatedContent/
                    AnimatedContent.tsx
                Antigravity/
                    Antigravity.tsx
                BlobCursor/
                    BlobCursor.tsx
                ClickSpark/
                    ClickSpark.tsx
                Crosshair/
                    Crosshair.tsx
                Cubes/
                    Cubes.tsx
                ElectricBorder/
                    ElectricBorder.tsx
                FadeContent/
                    FadeContent.tsx
                GhostCursor/
                    GhostCursor.tsx
                GlareHover/
                    GlareHover.tsx
                GradualBlur/
                    GradualBlur.tsx
                ImageTrail/
                    ImageTrail.tsx
                LaserFlow/
                    LaserFlow.tsx
                LogoLoop/
                    LogoLoop.tsx
                MagicRings/
                    MagicRings.tsx
                Magnet/
                    Magnet.tsx
                MagnetLines/
                    MagnetLines.tsx
                MetaBalls/
                    MetaBalls.tsx
                MetallicPaint/
                    MetallicPaint.tsx
                Noise/
                    Noise.tsx
                OrbitImages/
                    OrbitImages.tsx
                PixelTrail/
                    PixelTrail.tsx
                PixelTransition/
                    PixelTransition.tsx
                Ribbons/
                    Ribbons.tsx
                ShapeBlur/
                    ShapeBlur.tsx
                SplashCursor/
                    SplashCursor.tsx
                StarBorder/
                    StarBorder.tsx
                StickerPeel/
                    StickerPeel.tsx
                Strands/
                    Strands.tsx
                TargetCursor/
                    TargetCursor.tsx
            Backgrounds/
                Aurora/
                    Aurora.tsx
                Balatro/
                    Balatro.tsx
                Ballpit/
                    Ballpit.tsx
                Beams/
                    Beams.tsx
                ColorBends/
                    ColorBends.tsx
                DarkVeil/
                    DarkVeil.tsx
                Dither/
                    Dither.tsx
                DotField/
                    DotField.tsx
                DotGrid/
                    DotGrid.tsx
                EvilEye/
                    EvilEye.tsx
                FaultyTerminal/
                    FaultyTerminal.tsx
                Ferrofluid/
                    Ferrofluid.tsx
                FloatingLines/
                    FloatingLines.tsx
                Galaxy/
                    Galaxy.tsx
                GradientBlinds/
                    GradientBlinds.tsx
                Grainient/
                    Grainient.tsx
                GridDistortion/
                    GridDistortion.tsx
                GridMotion/
                    GridMotion.tsx
                GridScan/
                    GridScan.tsx
                Hyperspeed/
                    Hyperspeed.tsx
                    HyperSpeedPresets.ts
                Iridescence/
                    Iridescence.tsx
                LetterGlitch/
                    LetterGlitch.tsx
                Lightfall/
                    Lightfall.tsx
                Lightning/
                    Lightning.tsx
                LightPillar/
                    LightPillar.tsx
                LightRays/
                    LightRays.tsx
                LineWaves/
                    LineWaves.tsx
                LiquidChrome/
                    LiquidChrome.tsx
                LiquidEther/
                    LiquidEther.tsx
                Orb/
                    Orb.tsx
                Particles/
                    Particles.tsx
                PixelBlast/
                    PixelBlast.tsx
                PixelSnow/
                    PixelSnow.tsx
                Plasma/
                    Plasma.tsx
                PlasmaWave/
                    PlasmaWave.tsx
                Prism/
                    Prism.tsx
                PrismaticBurst/
                    PrismaticBurst.tsx
                Radar/
                    Radar.tsx
                RippleGrid/
                    RippleGrid.tsx
                ShapeGrid/
                    ShapeGrid.tsx
                SideRays/
                    SideRays.tsx
                Silk/
                    Silk.tsx
                SoftAurora/
                    SoftAurora.tsx
                Threads/
                    Threads.tsx
                Waves/
                    Waves.tsx
            Components/
                AnimatedList/
                    AnimatedList.tsx
                BorderGlow/
                    BorderGlow.tsx
                BounceCards/
                    BounceCards.tsx
                BubbleMenu/
                    BubbleMenu.tsx
                CardNav/
                    CardNav.tsx
                CardSwap/
                    CardSwap.tsx
                Carousel/
                    Carousel.tsx
                ChromaGrid/
                    ChromaGrid.tsx
                CircularGallery/
                    CircularGallery.tsx
                Counter/
                    Counter.tsx
                DecayCard/
                    DecayCard.tsx
                Dock/
                    Dock.tsx
                DomeGallery/
                    DomeGallery.tsx
                ElasticSlider/
                    ElasticSlider.tsx
                FlowingMenu/
                    FlowingMenu.tsx
                FluidGlass/
                    FluidGlass.tsx
                FlyingPosters/
                    FlyingPosters.tsx
                Folder/
                    Folder.tsx
                GlassIcons/
                    GlassIcons.tsx
                GlassSurface/
                    GlassSurface.tsx
                GooeyNav/
                    GooeyNav.tsx
                InfiniteMenu/
                    InfiniteMenu.tsx
                Lanyard/
                    card.glb
                    Lanyard.tsx
                MagicBento/
                    MagicBento.tsx
                Masonry/
                    Masonry.tsx
                ModelViewer/
                    ModelViewer.tsx
                PillNav/
                    PillNav.tsx
                PixelCard/
                    PixelCard.tsx
                ProfileCard/
                    ProfileCard.tsx
                ReflectiveCard/
                    ReflectiveCard.tsx
                ScrollStack/
                    ScrollStack.tsx
                SpotlightCard/
                    SpotlightCard.tsx
                Stack/
                    Stack.tsx
                StaggeredMenu/
                    StaggeredMenu.tsx
                Stepper/
                    Stepper.tsx
                TiltedCard/
                    TiltedCard.tsx
            TextAnimations/
                ASCIIText/
                    ASCIIText.tsx
                BlurText/
                    BlurText.tsx
                CircularText/
                    CircularText.tsx
                CountUp/
                    CountUp.tsx
                CurvedLoop/
                    CurvedLoop.tsx
                DecryptedText/
                    DecryptedText.tsx
                FallingText/
                    FallingText.tsx
                FuzzyText/
                    FuzzyText.tsx
                GlitchText/
                    GlitchText.tsx
                GradientText/
                    GradientText.tsx
                RotatingText/
                    RotatingText.tsx
                ScrambledText/
                    ScrambledText.tsx
                ScrollFloat/
                    ScrollFloat.tsx
                ScrollReveal/
                    ScrollReveal.tsx
                ScrollVelocity/
                    ScrollVelocity.tsx
                ShinyText/
                    ShinyText.tsx
                Shuffle/
                    Shuffle.tsx
                SplitText/
                    SplitText.tsx
                TextCursor/
                    TextCursor.tsx
                TextPressure/
                    TextPressure.tsx
                TextType/
                    TextType.tsx
                TrueFocus/
                    TrueFocus.tsx
                VariableProximity/
                    VariableProximity.tsx
        utils/
            animationUtils.js
            cli.js
            codeGeneration.js
            codeTheme.js
            customTheme.js
            favorites.js
            fuzzy.js
            utils.js
```

## Core Logic Samples

### `CONTRIBUTING.md`
```
# Contributing to React Bits

Thank you for considering contributing to React Bits! I appreciate your interest in making this project better.

To ensure a smooth collaboration, please read the following guidelines before getting started.

## Issue Tracker

We use the GitHub issue tracker to keep track of bugs, feature requests, and other project-related discussions. Before starting to work on a new feature or bug fix, please check the issue tracker to see if there's an existing issue or discussion related to it. If not, feel free to create a new issue.

## Branch Naming

When creating branches for your contributions, please follow the following naming convention:

`feat/<feature-name>`

For example, if you are working on a feature related to adding a new component, your branch name could be `feat/fix-x-component`. This naming convention helps us to easily track and associate contributions with their respective features.

## Pull Requests

We welcome pull requests from everyone as long as they respect the quality standards of this project. To submit a pull request, please follow these steps:

1. Fork the repository and create a new branch based on the branch naming convention mentioned above.
2. Make your changes in the new branch.
3. Submit a pull request to the main repository's `main` branch.
4. Provide a clear and descriptive title for your pull request, along with a detailed description of the changes you have made, and screenshots/videos where possible.
5. For components updates, ensure that changes are reflected in all related files. Each component change must be updated in all 4 variants of that particular component.
6. Before you open a pull request, please make sure that your changes are tested locally, and everything looks good on desktop and mobile, also check the browser console for errors, and so on, so that we can keep this library at the highest quality possible.
7. Any pull requests that fail to meet these requirements will be denied, so please make sure you respect them so that your work can go through.

## Note

New components from the community are currently not being accepted into the library, only component enhancements and bug fixes are open for contributions.

## Conclusion

I appreciate your interest in contributing! By following these guidelines, you can help us maintain a healthy and productive open-source community. I value your contributions and look forward to your pull requests!

If you have any questions or need further assistance, please don't hesitate to reach out to us through the issue tracker or other communication channels mentioned in the project's documentation.

Happy contributing!
```

### `jsrepo.config.ts`
```
import { defineConfig, type RegistryItem } from 'jsrepo';
import { output } from '@jsrepo/shadcn';
import { type Category, componentMetadata, type Variant } from './src/constants/Information';

export default defineConfig({
  registry: {
    name: '@react-bits',
    description:
      'An open source collection of animated, interactive & fully customizable React components for building stunning, memorable user interfaces.',
    homepage: 'https://reactbits.dev',
    authors: ['David Haz'],
    bugs: 'https://github.com/DavidHDev/react-bits/issues',
    repository: 'https://github.com/DavidHDev/react-bits',
    tags: [
      'react',
      'javascript',
      'components',
      'web',
      'reactjs',
      'css-animations',
      'component-library',
      'ui-components',
      '3d',
      'ui-library',
      'tailwind',
      'tailwindcss',
      'components',
      'components-library'
    ],
    excludeDeps: ['react'],
    outputs: [output({ dir: 'public/r', format: true })],
    items: [
      ...Object.values(componentMetadata).map(component =>
        defineComponent({
          title: component.name,
          description: component.description,
          category: component.category,
          categories: [component.category],
          meta: component.meta,
          variants: component.variants
        })
      )
    ].flat()
  }
});

/**
 * Define a component to be exposed from the registry. Creates the 4 different variants of the component and ensures the correct files are included.
 *
 * @param title The title of the component.
 * @param description The description of the component.
 * @param category The category of the component.
 * @param categories Organize the component into multiple categories.
 * @param meta Optional meta data for the component.
 * @param variants The variants of the component that are available through the registry (default: all variants)
 * @returns An array of RegistryItem objects.
 */
function defineComponent({
  title,
  description,
  category,
  categories,
  meta,
  variants = ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW']
}: {
  title: string;
  description: string;
  category: Category;
  categories?: string[];
  meta?: Record<string, string>;
  variants?: readonly Variant[];
}): RegistryItem[] {
  const baseItem: Omit<RegistryItem, 'files' | 'name'> = {
    title,
    description,
    type: 'registry:component',
    categories: [category, ...(categories ?? [])],
    meta,
    ...(title === 'Lanyard' ? { dependencyResolution: 'manual' as const } : {})
  };

  const filesForVariant = (basePath: string, sourceFile: string, styleFile?: string) =>
    title === 'Lanyard'
      ? [
          ...(styleFile ? [{ path: `${basePath}/${styleFile}` }] : []),
          { path: `${basePath}/${sourceFile}` }
        ]
      : [{ path: basePath }];

  // this might warrant a bit of explanation
  // basically we check if the variant is included in the variants array and if so we return the item as part of an array
  // otherwise we return an empty array
  // we then spread that array empty or otherwise into the return array
  return [
    // JS + CSS
    ...(variants.includes('JS-CSS')
      ? [
          {
            ...baseItem,
            name: `${baseItem.title}-JS-CSS`,
            files: filesForVariant(`src/content/${category}/${title}`, `${title}.jsx`, `${title}.css`)
          }
        ]
      : []),

    // JS + Tailwind
    ...(variants.includes('JS-TW')
      ? [
          {
            ...baseItem,
            name: `${baseItem.title}-JS-TW`,
            files: filesForVariant(`src/tailwind/${category}/${title}`, `${title}.jsx`)
          }
        ]
      : []),

    // TS + CSS
    ...(variants.includes('TS-CSS')
      ? [
          {
            ...baseItem,
            name: `${baseItem.title}-TS-CSS`,
            files: filesForVariant(`src/ts-default/${category}/${title}`, `${title}.tsx`, `${title}.css`)
          }
        ]
      : []),

    // TS + Tailwind
    ...(variants.includes('TS-TW')
      ? [
          {
            ...baseItem,
            name: `${baseItem.title}-TS-TW`,
            files: filesForVariant(`src/ts-tailwind/${category}/${title}`, `${title}.tsx`)
          }
        ]
      : [])
  ];
}
```

### `LICENSE.md`
```
MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell, sublicense, or redistribute the components themselves-whether alone, in a bundle, or as a ported version.**

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### `package-lock.json`
```
{
  "name": "react-bits",
  "version": "0.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "react-bits",
      "version": "0.0.0",
      "dependencies": {
        "@chakra-ui/icons": "^2.2.4",
        "@chakra-ui/react": "^3.20.0",
        "@emotion/react": "^11.14.0",
        "@gsap/react": "^2.1.2",
        "@react-three/drei": "^10.7.4",
        "@react-three/fiber": "^9.3.0",
        "@react-three/postprocessing": "^3.0.4",
        "@react-three/rapier": "^2.1.0",
        "@tailwindcss/vite": "^4.0.3",
        "@use-gesture/react": "^10.2.27",
        "class-variance-authority": "^0.7.1",
        "clsx": "^2.1.1",
        "face-api.js": "^0.22.2",
        "geist": "^1.7.0",
        "gl-matrix": "^3.4.3",
        "gsap": "^3.13.0",
        "lenis": "^1.3.13",
        "lucide-react": "^0.542.0",
        "maath": "^0.10.8",
        "mathjs": "^14.6.0",
        "matter-js": "^0.20.0",
        "meshline": "^3.3.1",
        "motion": "^12.23.12",
        "next-themes": "^0.4.6",
        "nuqs": "^2.8.6",
        "ogl": "^1.0.11",
        "postprocessing": "^6.36.0",
        "react": "^19.0.0",
        "react-confetti": "^6.2.2",
        "react-dom": "^19.0.0",
        "react-haiku": "^2.2.0",
        "react-icons": "^5.5.0",
        "react-router-dom": "^6.30.1",
        "react-syntax-highlighter": "^15.6.1",
        "react-virtualized": "^9.22.6",
        "sonner": "^1.7.1",
        "tailwind-merge": "^3.3.1",
        "tailwindcss": "^4.0.3",
        "three": "^0.167.1"
      },
      "devDependencies": {
        "@jsrepo/shadcn": "^2.0.0",
        "@types/matter-js": "^0.19.8",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        "@types/three": "^0.180.0",
        "@vitejs/plugin-react": "^4.3.4",
        "concurrently": "^9.1.2",
        "eslint": "^8.57.0",
        "eslint-plugin-react": "^7.34.3",
        "eslint-plugin-react-hooks": "^4.6.2",
        "eslint-plugin-react-refresh": "^0.4.7",
        "jsrepo": "^3.2.0",
        "postcss-safe-parser": "^7.0.1",
        "prettier": "^3.6.2",
        "tw-animate-css": "^1.4.0",
        "typescript": "^5.7.3",
        "vite": "^5.3.4"
      }
    },
    "node_modules/@ark-ui/react": {
      "version": "5.25.0",
      "resolved": "https://registry.npmjs.org/@ark-ui/react/-/react-5.25.0.tgz",
      "integrity": "sha512-+r91hfLQNmGbM37rvwu6Ppy7Xaa1Dww80spn49xHhiS8ZCYQbZyPNzgOEVoSjURiroLkLdQdh869OscfczkAyA==",
      "license": "MIT",
      "dependencies": {
        "@internationalized/date": "3.9.0",
        "@zag-js/accordion": "1.24.1",
        "@zag-js/anatomy": "1.24.1",
        "@zag-js/angle-slider": "1.24.1",
        "@zag-js/async-list": "1.24.1",
        "@zag-js/auto-resize": "1.24.1",
        "@zag-js/avatar": "1.24.1",
        "@zag-js/carousel": "1.24.1",
        "@zag-js/checkbox": "1.24.1",
        "@zag-js/clipboard": "1.24.1",
        "@zag-js/collapsible": "1.24.1",
        "@zag-js/collection": "1.24.1",
        "@zag-js/color-picker": "1.24.1",
        "@zag-js/color-utils": "1.24.1",
        "@zag-js/combobox": "1.24.1",
        "@zag-js/core": "1.24.1",
        "@zag-js/date-picker": "1.24.1",
        "@zag-js/date-utils": "1.24.1",
        "@zag-js/dialog": "1.24.1",
        "@zag-js/dom-query": "1.24.1",
        "@zag-js/editable": "1.24.1",
        "@zag-js/file-upload": "1.24.1",
        "@zag-js/file-utils": "1.24.1",
        "@zag-js/floating-panel": "1.24.1",
        "@zag-js/focus-trap": "1.24.1",
        "@zag-js/highlight-word": "1.24.1",
        "@zag-js/hover-card": "1.24.1",
        "@zag-js/i18n-utils": "1.24.1",
        "@zag-js/json-tree-utils": "1.24.1",
        "@zag-js/listbox": "1.24.1",
        "@zag-js/menu": "1.24.1",
        "@zag-js/number-input": "1.24.1",
        "@zag-js/pagination": "1.24.1",
        "@zag-js/password-input": "1.24.1",
        "@zag-js/pin-input": "1.24.1",
        "@zag-js/popover": "1.24.1",
        "@zag-js/presence": "1.24.1",
        "@zag-js/progress": "1.24.1",
        "@zag-js/qr-code": "1.24.1",
        "@zag-js/radio-group": "1.24.1",
        "@zag-js/rating-group": "1.24.1",
        "@zag-js/react": "1.24.1",
        "@zag-js/scroll-area": "1.24.1",
        "@zag-js/select": "1.24.1",
        "@zag-js/signature-pad": "1.24.1",
        "@zag-js/slider": "1.24.1",
        "@zag-js/splitter": "1.24.1",
        "@zag-js/steps": "1.24.1",
        "@zag-js/switch": "1.24.1",
        "@zag-js/tabs": "1.24.1",
        "@zag-js/tags-input": "1.24.1",
        "@zag-js/timer": "1.24.1",
        "@zag-js/toast": "1.24.1",
        "@zag-js/toggle": "1.24.1",
        "@zag-js/toggle-group": "1.24.1",
        "@zag-js/tooltip": "1.24.1",
        "@zag-js/tour": "1.24.1",
        "@zag-js/tree-view": "1.24.1",
        "@zag-js/types": "1.24.1",
        "@zag-js/utils": "1.24.1"
      },
      "peerDependencies": {
        "react": ">=18.0.0",
        "react-dom": ">=18.0.0"
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.27.1.tgz",
      "integrity": "sha512-cjQ7ZlQ0Mv3b47hABuTevyTuYN4i+loJKGeV9flcCgIK37cCXRh+L1bd3iBHlynerhQ7BhCkn2BPbQUL+rGqFg==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.27.1",
        "js-tokens": "^4.0.0",
        "picocolors": "^1.1.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "7.28.4",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.28.4.tgz",
      "integrity": "sha512-YsmSKC29MJwf0gF8Rjjrg5LQCmyh+j/nD8/eP7f+BeoQTKYqs9RoWbjGOdy0+1Ekr68RJZMUOPVQaQisnIo4Rw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/core": {
      "version": "7.28.4",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.28.4.tgz",
      "integrity": "sha512-2BCOP7TN8M+gVDj7/ht3hsaO/B/n5oDbiAyyvnRlNOs+u1o+JWNYTQrmpuNp1/Wq2gcFrI01JAW+paEKDMx/CA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.27.1",
        "@babel/generator": "^7.28.3",
        "@babel/helper-compilation-targets": "^7.27.2",
        "@babel/helper-module-transforms": "^7.28.3",
        "@babel/helpers": "^7.28.4",
        "@babel/parser": "^7.28.4",
        "@babel/template": "^7.27.2",
        "@babel/traverse": "^7.28.4",
        "@babel/types": "^7.28.4",
        "@jridgewell/remapping": "^2.3.5",
        "convert-source-map": "^2.0.0",
        "debug": "^4.1.0",
        "gensync": "^1.0.0-beta.2",
        "json5": "^2.2.3",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/core/node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@babel/generator": {
      "version": "7.28.3",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.28.3.tgz",
      "integrity": "sha512-3lSpxGgvnmZznmBkCRnVREPUFJv2wrv9iAoFDvADJc0ypmdOxdUtcLeBgBJ6zE0PMeTKnxeQzyk0xTBq4Ep7zw==",
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.28.3",
        "@babel/types": "^7.28.2",
        "@jridgewell/gen-mapping": "^0.3.12",
        "@jridgewell/trace-mapping": "^0.3.28",
        "jsesc": "^3.0.2"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "7.27.2",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.27.2.tgz",
      "integrity": "sha512-2+1thGUUWWjLTYTHZWK1n8Yga0ijBz1XAhUXcKy81rd5g6yh7hGqMp45v7cadSbEHc9G3OTv45SyneRN3ps4DQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/compat-data": "^7.27.2",
        "@babel/helper-validator-option": "^7.27.1",
        "browserslist": "^4.24.0",
        "lru-cache": "^5.1.1",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-globals": {
      "version": "7.28.0",
      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.28.0.tgz",
      "integrity": "sha512-+W6cISkXFa1jXsDEdYA8HeevQT/FULhxzR99pxphltZcVaugps53THCeiWA8SguxxpSp3gKPiuYfSWopkLQ4hw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-imports": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.27.1.tgz",
      "integrity": "sha512-0gSFWUPNXNopqtIPQvlD5WgXYI5GY2kP2cCvoT8kczjbfcfuIljTbcWrulD1CIPIX2gt1wghbDy08yE1p+/r3w==",
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.27.1",
        "@babel/types": "^7.27.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-transforms": {
      "version": "7.28.3",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.28.3.tgz",
      "integrity": "sha512-gytXUbs8k2sXS9PnQptz5o0QnpLL51SwASIORY6XaBKF88nsOT0Zw9szLqlSGQDP/4TljBAD5y98p2U1fqkdsw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.27.1",
        "@babel/helper-validator-identifier": "^7.27.1",
        "@babel/traverse": "^7.28.3"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-plugin-utils": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.27.1.tgz",
      "integrity": "sha512-1gn1Up5YXka3YYAHGKpbideQ5Yjf1tDa9qYcgysz+cNCXukyLl6DjPXhD3VRwSb8c0J9tA4b2+rHEZtc6R0tlw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.27.1.tgz",
      "integrity": "sha512-qMlSxKbpRlAridDExk92nSobyDdpPijUq2DW6oDnUqd0iOGxmQjyqhMIihI9+zv4LPyZdRje2cavWPbCbWm3eA==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.27.1.tgz",
      "integrity": "sha512-D2hP9eA+Sqx1kBZgzxZh0y1trbuU+JoDkiEwqhQ36nodYqJwyEIhPSdMNd7lOm/4io72luTPWH20Yda0xOuUow==",

... [TRUNCATED] ...
```

### `package.json`
```
{
  "name": "react-bits",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "concurrently -n \"registry,docs\" -c \"blue,green\" \"npm run registry:dev\" \"vite\"",
    "build": "npm run registry:build && npm run llms:text && npm run sitemap && vite build",
    "new:component": "node scripts/generateComponent.js",
    "llms:text": "node ./scripts/generateLlmsText.js",
    "sitemap": "node ./scripts/generateSitemap.js",
    "registry:build": "jsrepo build",
    "registry:dev": "jsrepo build --watch",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@chakra-ui/icons": "^2.2.4",
    "@chakra-ui/react": "^3.20.0",
    "@emotion/react": "^11.14.0",
    "@gsap/react": "^2.1.2",
    "@react-three/drei": "^10.7.4",
    "@react-three/fiber": "^9.3.0",
    "@react-three/postprocessing": "^3.0.4",
    "@react-three/rapier": "^2.1.0",
    "@tailwindcss/vite": "^4.0.3",
    "@use-gesture/react": "^10.2.27",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "face-api.js": "^0.22.2",
    "geist": "^1.7.0",
    "gl-matrix": "^3.4.3",
    "gsap": "^3.13.0",
    "lenis": "^1.3.13",
    "lucide-react": "^0.542.0",
    "maath": "^0.10.8",
    "mathjs": "^14.6.0",
    "matter-js": "^0.20.0",
    "meshline": "^3.3.1",
    "motion": "^12.23.12",
    "next-themes": "^0.4.6",
    "nuqs": "^2.8.6",
    "ogl": "^1.0.11",
    "postprocessing": "^6.36.0",
    "react": "^19.0.0",
    "react-confetti": "^6.2.2",
    "react-dom": "^19.0.0",
    "react-haiku": "^2.2.0",
    "react-icons": "^5.5.0",
    "react-router-dom": "^6.30.1",
    "react-syntax-highlighter": "^15.6.1",
    "react-virtualized": "^9.22.6",
    "sonner": "^1.7.1",
    "tailwind-merge": "^3.3.1",
    "tailwindcss": "^4.0.3",
    "three": "^0.167.1"
  },
  "devDependencies": {
    "@jsrepo/shadcn": "^2.0.0",
    "@types/matter-js": "^0.19.8",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/three": "^0.180.0",
    "@vitejs/plugin-react": "^4.3.4",
    "concurrently": "^9.1.2",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.3",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "jsrepo": "^3.2.0",
    "postcss-safe-parser": "^7.0.1",
    "prettier": "^3.6.2",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5.7.3",
    "vite": "^5.3.4"
  }
}
```

### `README.md`
```
<div align="center">
	<br>
	<br>
    <picture>
      <source media="(prefers-color-scheme: light)" srcset="src/assets/logos/reactbits-gh-black.svg">
      <source media="(prefers-color-scheme: dark)" srcset="src/assets/logos/reactbits-gh-white.svg">
      <img src="src/assets/logos/reactbits-gh-black.svg" alt="react-bits logo" width="600">
    </picture>
	<br>
	<br>
  <strong>The largest & most creative library of animated React components.</strong>
  <br />
  <sub>Stand out with 130+ free, customizable animations for text, backgrounds, and UI.</sub>
	<br>
	<br>
  <a href="https://github.com/davidhdev/react-bits/stargazers"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/davidhdev/react-bits"></a>
  <a href="https://github.com/davidhdev/react-bits/blob/main/LICENSE.md"><img alt="License" src="https://img.shields.io/badge/License-MIT+Commons_Clause-magenta"></a>
  <br>
  <br>
  <a href="https://reactbits.dev/">📖 Documentation</a> · <a href="https://reactbits.dev/get-started/installation">⚡ Quick Start</a> · <a href="https://reactbits.dev/tools">🛠️ Tools</a>
</div>

<br />

<div align="center">
  <img src="src/assets/common/gh-showcase.png" alt="React Bits component showcase" width="1000">
</div>

<br />

## ✨ Why React Bits?

React Bits helps you **ship stunning interfaces faster**. Instead of spending hours crafting animations from scratch, grab a polished component and customize it to fit your vision.

> 💬 **Text Animations** · 🌀 **Animations** · 🧩 **Components** · 🖼️ **Backgrounds**

## 🚀 Features

- **130+ components** — text animations, UI elements, and backgrounds, growing weekly
- **Minimal dependencies** — lightweight and tree-shakeable
- **Fully customizable** — tweak everything via props or edit the source directly
- **4 variants per component** — JS-CSS, JS-TW, TS-CSS, TS-TW (everyone's happy)
- **Copy-paste ready** — works with any modern React project

## 🛠️ Creative Tools

<div align="center">
  <img src="src/assets/common/tools-readme.webp" alt="React Bits Tools" width="1000" style="border-radius: 30px; max-width: 1920px;">
</div>

<hr />

### Beyond components, React Bits offers **free creative tools** to supercharge your workflow:

| Tool                                                 | What it does                                                                             |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **[Background Studio](https://reactbits.dev/tools)** | Explore animated backgrounds, customize effects, export as video/image/code              |
| **[Shape Magic](https://reactbits.dev/tools)**       | Create inner rounded corners between shapes, export as SVG, React code or clip-path code |
| **[Texture Lab](https://reactbits.dev/tools)**       | Apply 20+ effects (noise, dithering, ASCII) to images/videos and export in high quality  |

## 📦 Installation

React Bits supports [shadcn](https://ui.shadcn.com/) and [jsrepo](https://jsrepo.dev) for quick CLI installs.

```bash
# Example: Add a component via shadcn
npx shadcn@latest add @react-bits/BlurText-TS-TW
```

Each component page includes copy-ready CLI commands. See the [installation guide](https://reactbits.dev/get-started/installation) for full details.

You can also select your preferred technologies, and copy the code manually.

## 🚀 Sponsors

React Bits is proudly supported by these amazing sponsors:

### Diamond

<a href="https://www.shadcnblocks.com/?utm_source=reactbits&utm_medium=sponsor&utm_campaign=diamond&ref=reactbits" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/assets/sponsors/shadcnblocks.svg">
    <source media="(prefers-color-scheme: light)" srcset="public/assets/sponsors/shadcnblocks-lightmode.svg">
    <img src="public/assets/sponsors/shadcnblocks.svg" alt="shadcnblocks.com" style="height: 50px;">
  </picture>
</a>
&nbsp;&nbsp;&nbsp;
<a href="https://shadcnstudio.com/?utm_source=reactbits&utm_medium=sponsor&utm_campaign=diamond&ref=reactbits" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/assets/sponsors/shadcnstudio.svg">
    <source media="(prefers-color-scheme: light)" srcset="public/assets/sponsors/shadcnstudio-lightmode.svg">
    <img src="public/assets/sponsors/shadcnstudio.svg" alt="shadcn studio" style="height: 50px;">
  </picture>
</a>

### Platinum

<a href="https://pro.tailark.com/?utm_source=reactbits&utm_medium=sponsor&utm_campaign=platinum&ref=reactbits" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/assets/sponsors/tailark.svg">
    <source media="(prefers-color-scheme: light)" srcset="public/assets/sponsors/tailark-lightmode.svg">
    <img src="public/assets/sponsors/tailark.svg" alt="Tailark" style="height: 50px;">
  </picture>
</a>

### Silver

<a href="https://nextjsweekly.com/?utm_source=reactbits&utm_medium=sponsor&utm_campaign=silver&ref=reactbits" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/assets/sponsors/nextjsweekly.svg">
    <source media="(prefers-color-scheme: light)" srcset="public/assets/sponsors/nextjsweekly-lightmode.svg">
    <img src="public/assets/sponsors/nextjsweekly.svg" alt="Next.js Weekly" style="height: 40px;">
  </picture>
</a>
&nbsp;&nbsp;&nbsp;
<a href="https://shadcncraft.com/?utm_source=reactbits&utm_medium=sponsor&utm_campaign=silver&ref=reactbits" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/assets/sponsors/shadcncraft.svg">
    <source media="(prefers-color-scheme: light)" srcset="public/assets/sponsors/shadcncraft-lightmode.svg">
    <img src="public/assets/sponsors/shadcncraft.svg" alt="Shadcncraft" style="height: 40px;">
  </picture>
</a>

<hr />

**[Become a sponsor](https://reactbits.dev/sponsors)** — Get your brand in front of 500K+ developers monthly.

## 🤝 Contributing

We'd love your help! Check the [open issues](https://github.com/DavidHDev/react-bits/issues) or submit ideas via the [feature request template](https://github.com/DavidHDev/react-bits/issues/new?template=2-feature-request.yml).

Please read the [contribution guide](https://github.com/DavidHDev/react-bits/blob/main/CONTRIBUTING.md) first — thanks for making React Bits better!

## 🙌 Contributors

<a href="https://github.com/davidhdev/react-bits/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=davidhdev/react-bits" />
</a>

## 👤 Maintainer

**[David Haz](https://github.com/DavidHDev)** — creator & lead maintainer

## 🌐 Official Ports

| Framework | Link                                      |
| --------- | ----------------------------------------- |
| Vue.js    | [vue-bits.dev](https://vue-bits.dev/)     |
| Svelte    | [sveltebits.xyz](https://sveltebits.xyz/) |

## 📊 Stats

![Repobeats analytics](https://repobeats.axiom.co/api/embed/b1bf4dc0226458617adbdbf5586f2df953eb0922.svg 'Repobeats analytics image')

## 🗳️ Credit

React Bits occasionally draws inspiration from publicly available code examples. These are rewritten as full-fledged, customizable components for JS, TS, CSS, and Tailwind. If you recognize your work, [open an issue](https://github.com/DavidHDev/react-bits/issues) to request credit.

## 📄 License

[MIT + Commons Clause](https://github.com/davidhdev/react-bits/blob/main/LICENSE.md) — free for personal and commercial use.
```

### `tsconfig.json`
```
{
  "compilerOptions": {
    "allowJs": true,
    "strict": true,
    "checkJs": false,
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "ESNext",
    "target": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "noEmit": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### `vite.config.js`
```
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import safeParser from 'postcss-safe-parser';

import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: true
  },
  resolve: {
    alias: {
      '@': '/src',
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@content': path.resolve(__dirname, 'src/content'),
      '@tailwind': path.resolve(__dirname, 'src/tailwind'),
      '@ts-default': path.resolve(__dirname, 'src/ts-default'),
      '@ts-tailwind': path.resolve(__dirname, 'src/ts-tailwind'),
      'react-virtualized': 'react-virtualized/dist/commonjs'
    }
  },
  css: {
    postcss: {
      parser: safeParser
    }
  },
  assetsInclude: ['**/*.glb']
});
```

### `.context\new-component.md`
```
# React Bits – New Component Creation Context

This file provides complete, concrete context for an AI agent to reliably create new components in this repository. It is based on the OrbitImages component as a reference implementation.

---

## 0. Prerequisites

Run the scaffolding script first. It creates empty files and registers the component in `Components.js`, `Categories.js`, and `Information.js` automatically.

```bash
npm run new:component -- <Category> <ComponentName>
# Example: npm run new:component -- Animations OrbitImages
```

This creates:
- `src/content/<Category>/<ComponentName>/<ComponentName>.jsx` (empty)
- `src/content/<Category>/<ComponentName>/<ComponentName>.css` (empty)
- `src/tailwind/<Category>/<ComponentName>/<ComponentName>.jsx` (empty)
- `src/ts-default/<Category>/<ComponentName>/<ComponentName>.tsx` (empty)
- `src/ts-default/<Category>/<ComponentName>/<ComponentName>.css` (empty)
- `src/ts-tailwind/<Category>/<ComponentName>/<ComponentName>.tsx` (empty)
- `src/demo/<Category>/<ComponentName>Demo.jsx` (scaffold with Noise component placeholder)
- `src/constants/code/<Category>/<camelCaseName>Code.js` (empty)
- Entries in `Components.js`, `Categories.js`, `Information.js`

After scaffolding, you fill in the 8 files (4 variants + demo + code metadata + 2 CSS files for CSS variants).

---

## 1. Four Variant Rules

All four variants must produce **identical visual output and behavior**. The differences are only:

| Variant | Path | Language | Styling |
|---|---|---|---|
| JS + CSS | `src/content/…/<Name>.jsx` + `.css` | JavaScript | CSS classes imported via `./Name.css` |
| JS + Tailwind | `src/tailwind/…/<Name>.jsx` | JavaScript | Tailwind utility classes inline |
| TS + CSS | `src/ts-default/…/<Name>.tsx` + `.css` | TypeScript | CSS classes imported via `./Name.css` |
| TS + Tailwind | `src/ts-tailwind/…/<Name>.tsx` | TypeScript | Tailwind utility classes inline |

### JS + CSS variant rules
- Import `'./ComponentName.css'`
- Use named CSS classes for layout/styling (e.g. `.orbit-container`, `.orbit-item`)
- No TypeScript, no type annotations
- Props destructured with defaults in function signature
- `export default function ComponentName({ ... }) {}`

### JS + Tailwind variant rules
- **No** CSS import
- Replace every CSS class with Tailwind utility classes inline
- Same logic, same props, same defaults as JS+CSS

### TS + CSS variant rules
- Same CSS file content (duplicated into `ts-default/`)
- Import `'./ComponentName.css'`
- Add TypeScript `interface` for props
- Add `type` aliases for union types
- Type all refs: `useRef<HTMLDivElement>(null)`
- Type function params and return types for helpers
- Type motion values: `MotionValue<number>`

### TS + Tailwind variant rules
- **No** CSS import
- TypeScript interfaces + types (same as TS+CSS)
- Tailwind utility classes inline (same as JS+Tailwind)
- **No `cn()` utility**

### CSS file conventions
- Use component-scoped class names prefixed with component name (e.g. `.orbit-container`, `.orbit-item`)
- The CSS file in `ts-default/` is an exact copy of the one in `content/`
- Keep styles minimal – only what's needed for layout/positioning

---

## 2. Demo File Pattern

Location: `src/demo/<Category>/<ComponentName>Demo.jsx`

### Standard imports
```jsx
import { useMemo } from 'react';
import { Flex } from '@chakra-ui/react';  // or Box, depending on layout needs
import { CodeTab, PreviewTab, TabsLayout } from '../../components/common/TabsLayout';

import Customize from '../../components/common/Preview/Customize';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import CodeExample from '../../components/code/CodeExample';
import RefreshButton from '../../components/common/Preview/RefreshButton';
import PropTable from '../../components/common/Preview/PropTable';
import Dependencies from '../../components/code/Dependencies';
import useForceRerender from '../../hooks/useForceRerender';
import useComponentProps from '../../hooks/useComponentProps';
import { ComponentPropsProvider } from '../../components/context/ComponentPropsContext';

// Import the JS+CSS component (always from content/)
import ComponentName from '../../content/<Category>/<ComponentName>/<ComponentName>';
// Import code metadata
import { camelCaseName } from '../../constants/code/<Category>/<camelCaseName>Code';
```

### Demo structure
```jsx
const DEFAULT_PROPS = {
  // Only include props that have demo controls
  someProp: defaultValue,
};

const ComponentNameDemo = () => {
  const [key, forceRerender] = useForceRerender();
  const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
  const { someProp } = props;

  const propData = useMemo(() => [
    // ALL public props documented, not just controlled ones
    { name: 'propName', type: 'type', default: 'value', description: 'Description.' },
  ], []);

  return (
    <ComponentPropsProvider props={props} defaultProps={DEFAULT_PROPS} resetProps={resetProps} hasChanges={hasChanges}>
      <TabsLayout>
        <PreviewTab>
          <Flex overflow="hidden" justifyContent="center" alignItems="center"
            minH="400px" position="relative" className="demo-container">
            <ComponentName key={key} {...controlledProps} />
            <RefreshButton onClick={forceRerender} />
          </Flex>

          <Customize>
            {/* Controls here */}
          </Customize>

          <PropTable data={propData} />
          <Dependencies dependencyList={['dep1']} />
        </PreviewTab>

        <CodeTab>
          <CodeExample codeObject={camelCaseName} componentName="ComponentName" />
        </CodeTab>
      </TabsLayout>
    </ComponentPropsProvider>
  );
};

export default ComponentNameDemo;
```

### Control types
```jsx
// Slider
<PreviewSlider
  title="Label"
  min={0} max={100} step={1}
  value={propValue}
  valueUnit="px"  // optional suffix
  onChange={val => { updateProp('propName', val); forceRerender(); }}
/>

// Switch (boolean toggle)
<PreviewSwitch
  title="Label"
  isChecked={propValue}
  onChange={checked => { updateProp('propName', checked); forceRerender(); }}
/>

// Select (dropdown)
<PreviewSelect
  title="Label"
  name="unique-name"
  width={140}
  value={propValue}
  options={[{ label: 'Display', value: 'value' }]}
  onChange={val => { updateProp('propName', val); forceRerender(); }}
/>
```

### When to call `forceRerender()`
- Always call it for props that affect animation initialization or layout
- For live-updating props (like autoplay toggle), it may not be needed
- When in doubt, call it

---

## 3. Code Metadata File

Location: `src/constants/code/<Category>/<camelCaseName>Code.js`

```js
import code from '@content/<Category>/<ComponentName>/<ComponentName>.jsx?raw';
import css from '@content/<Category>/<ComponentName>/<ComponentName>.css?raw';
import tailwind from '@tailwind/<Category>/<ComponentName>/<ComponentName>.jsx?raw';
import tsCode from '@ts-default/<Category>/<ComponentName>/<ComponentName>.tsx?raw';
import tsTailwind from '@ts-tailwind/<Category>/<ComponentName>/<ComponentName>.tsx?raw';

export const camelCaseName = {
  dependencies: `dep1 dep2`,          // space-separated npm package names
  usage: `import ComponentName from './ComponentName'

<ComponentName
  prop1={value1}
  prop2={value2}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
```

- `dependencies`: space-separated string of npm packages (e.g. `"motion"`, `"gsap"`)
- `usage`: JSX code snippet showing basic usage (imports + JSX)
- Path aliases: `@content`, `@tailwind`, `@ts-default`, `@ts-tailwind` map to `src/content`, `src/tailwind`, etc.
- The `?raw` suffix imports file contents as a raw string (Vite feature)

---

## 4. Registration (Auto-generated by scaffolding)

These are handled by `npm run new:component` but for reference:

### `src/constants/Components.js`
```js
'kebab-case-name': () => import('../demo/<Category>/<ComponentName>Demo')
```

### `src/constants/Categories.js`
Component name added to the category's subcategories array and optionally to `NEW` array:
```js
export const NEW = ['Component Name', ...];
// And in the subcategories:
{ heading: 'Category', subcategories: ['Component Name', ...] }
```

### `src/constants/Information.js`
```js
'Category/ComponentName': {
  videoUrl: '/assets/video/componentname.webm',
  description: 'Short description.',
  category: 'Category',
  name: 'ComponentName',
  docsUrl: 'https://reactbits.dev/category/kebab-case-name',
  tags: []
},
```

---

## 5. Background Studio (backgrounds only)

If the component is in the `Backgrounds` category, also register it in:
`src/tools/background-studio/backgrounds/index.js`

And add `OpenInStudioButton` to the demo:
```jsx
import OpenInStudioButton from '../../components/common/Preview/OpenInStudioButton';

// After the preview, before <Customize>:
<Flex justify="flex-end" mt={2} mb={-2}>
  <OpenInStudioButton
    backgroundId="kebab-case-id"
    currentProps={{ ...controlledProps }}
    defaultProps={DEFAULT_PROPS}
  />
</Flex>
```

---

## 6. Naming Conventions

| Context | Format | Example |
|---|---|---|
| Component name | PascalCase | `OrbitImages` |
| File names | PascalCase matching component | `OrbitImages.jsx` |
| CSS class prefix | kebab-case component name | `.orbit-container` |
| Route slug | kebab-case | `orbit-images` |
| Code metadata export | camelCase | `orbitImages` |
| Code metadata file | camelCase + `Code.js` | `orbitImagesCode.js` |
| Category display name | Space-separated | `Orbit Images` |
| Folder name | PascalCase | `OrbitImages/` |

---

## 7. Checklist

Before considering a component complete:

- [ ] All 4 variant files are implemented with identical behavior
- [ ] CSS files in `content/` and `ts-default/` are identical
- [ ] TS variants have proper interfaces and type annotations
- [ ] Demo imports from `content/` (JS+CSS variant)
- [ ] Demo has `DEFAULT_PROPS`, `useComponentProps`, `ComponentPropsProvider`
- [ ] Demo has `RefreshButton`, `Customize` controls, `PropTable`, `Dependencies`
- [ ] Demo has `CodeTab` with `CodeExample`
- [ ] Code metadata uses `?raw` imports with correct path aliases
- [ ] Code metadata has `dependencies`, `usage`, `code`, `css`, `tailwind`, `tsCode`, `tsTailwind`
- [ ] Component is registered in `Components.js`, `Categories.js`, and `Information.js`

... [TRUNCATED] ...
```

### `public\README.md`
```
<div align="center">    <img src="https://github.com/EnderRomantice/react-bits/blob/main/public/favicon-32x32.png" alt="react-bits logo" height="200"></div>
<div align="center">
Welcome to React Bits, the go-to open source library for high quality animated React components!
</div>


```

### `public\r\AnimatedContent-JS-CSS.json`
```
{
	"$schema": "https://ui.shadcn.com/schema/registry-item.json",
	"name": "AnimatedContent-JS-CSS",
	"title": "AnimatedContent",
	"description": "Wrapper that animates any children on scroll or mount with configurable direction, distance, duration, easing and disappear options.",
	"type": "registry:component",
	"files": [
		{
			"type": "registry:component",
			"path": "AnimatedContent/AnimatedContent.jsx",
			"content": "import { useRef, useEffect } from 'react';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\n\ngsap.registerPlugin(ScrollTrigger);\n\nconst AnimatedContent = ({\n  children,\n  container,\n  distance = 100,\n  direction = 'vertical',\n  reverse = false,\n  duration = 0.8,\n  ease = 'power3.out',\n  initialOpacity = 0,\n  animateOpacity = true,\n  scale = 1,\n  threshold = 0.1,\n  delay = 0,\n  disappearAfter = 0,\n  disappearDuration = 0.5,\n  disappearEase = 'power3.in',\n  onComplete,\n  onDisappearanceComplete,\n  className = '',\n  ...props\n}) => {\n  const ref = useRef(null);\n\n  useEffect(() => {\n    const el = ref.current;\n    if (!el) return;\n\n    let scrollerTarget = container || document.getElementById('snap-main-container') || null;\n\n    if (typeof scrollerTarget === 'string') {\n      scrollerTarget = document.querySelector(scrollerTarget);\n    }\n\n    const axis = direction === 'horizontal' ? 'x' : 'y';\n    const offset = reverse ? -distance : distance;\n    const startPct = (1 - threshold) * 100;\n\n    gsap.set(el, {\n      [axis]: offset,\n      scale,\n      opacity: animateOpacity ? initialOpacity : 1,\n      visibility: 'visible'\n    });\n\n    const tl = gsap.timeline({\n      paused: true,\n      delay,\n      onComplete: () => {\n        if (onComplete) onComplete();\n        if (disappearAfter > 0) {\n          gsap.to(el, {\n            [axis]: reverse ? distance : -distance,\n            scale: 0.8,\n            opacity: animateOpacity ? initialOpacity : 0,\n            delay: disappearAfter,\n            duration: disappearDuration,\n            ease: disappearEase,\n            onComplete: () => onDisappearanceComplete?.()\n          });\n        }\n      }\n    });\n\n    tl.to(el, {\n      [axis]: 0,\n      scale: 1,\n      opacity: 1,\n      duration,\n      ease\n    });\n\n    const st = ScrollTrigger.create({\n      trigger: el,\n      scroller: scrollerTarget,\n      start: `top ${startPct}%`,\n      once: true,\n      onEnter: () => tl.play()\n    });\n\n    return () => {\n      st.kill();\n      tl.kill();\n    };\n  }, [\n    container,\n    distance,\n    direction,\n    reverse,\n    duration,\n    ease,\n    initialOpacity,\n    animateOpacity,\n    scale,\n    threshold,\n    delay,\n    disappearAfter,\n    disappearDuration,\n    disappearEase,\n    onComplete,\n    onDisappearanceComplete\n  ]);\n\n  return (\n    <div ref={ref} className={className} style={{ visibility: 'hidden' }} {...props}>\n      {children}\n    </div>\n  );\n};\n\nexport default AnimatedContent;\n"
		}
	],
	"registryDependencies": [],
	"dependencies": [
		"gsap@^3.13.0"
	]
}```

### `public\r\AnimatedContent-JS-TW.json`
```
{
	"$schema": "https://ui.shadcn.com/schema/registry-item.json",
	"name": "AnimatedContent-JS-TW",
	"title": "AnimatedContent",
	"description": "Wrapper that animates any children on scroll or mount with configurable direction, distance, duration, easing and disappear options.",
	"type": "registry:component",
	"files": [
		{
			"type": "registry:component",
			"path": "AnimatedContent/AnimatedContent.jsx",
			"content": "import { useRef, useEffect } from 'react';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\n\ngsap.registerPlugin(ScrollTrigger);\n\nconst AnimatedContent = ({\n  children,\n  container,\n  distance = 100,\n  direction = 'vertical',\n  reverse = false,\n  duration = 0.8,\n  ease = 'power3.out',\n  initialOpacity = 0,\n  animateOpacity = true,\n  scale = 1,\n  threshold = 0.1,\n  delay = 0,\n  disappearAfter = 0,\n  disappearDuration = 0.5,\n  disappearEase = 'power3.in',\n  onComplete,\n  onDisappearanceComplete,\n  className = '',\n  ...props\n}) => {\n  const ref = useRef(null);\n\n  useEffect(() => {\n    const el = ref.current;\n    if (!el) return;\n\n    let scrollerTarget = container || document.getElementById('snap-main-container') || null;\n\n    if (typeof scrollerTarget === 'string') {\n      scrollerTarget = document.querySelector(scrollerTarget);\n    }\n\n    const axis = direction === 'horizontal' ? 'x' : 'y';\n    const offset = reverse ? -distance : distance;\n    const startPct = (1 - threshold) * 100;\n\n    gsap.set(el, {\n      [axis]: offset,\n      scale,\n      opacity: animateOpacity ? initialOpacity : 1,\n      visibility: 'visible'\n    });\n\n    const tl = gsap.timeline({\n      paused: true,\n      delay,\n      onComplete: () => {\n        if (onComplete) onComplete();\n        if (disappearAfter > 0) {\n          gsap.to(el, {\n            [axis]: reverse ? distance : -distance,\n            scale: 0.8,\n            opacity: animateOpacity ? initialOpacity : 0,\n            delay: disappearAfter,\n            duration: disappearDuration,\n            ease: disappearEase,\n            onComplete: () => onDisappearanceComplete?.()\n          });\n        }\n      }\n    });\n\n    tl.to(el, {\n      [axis]: 0,\n      scale: 1,\n      opacity: 1,\n      duration,\n      ease\n    });\n\n    const st = ScrollTrigger.create({\n      trigger: el,\n      scroller: scrollerTarget,\n      start: `top ${startPct}%`,\n      once: true,\n      onEnter: () => tl.play()\n    });\n\n    return () => {\n      st.kill();\n      tl.kill();\n    };\n  }, [\n    container,\n    distance,\n    direction,\n    reverse,\n    duration,\n    ease,\n    initialOpacity,\n    animateOpacity,\n    scale,\n    threshold,\n    delay,\n    disappearAfter,\n    disappearDuration,\n    disappearEase,\n    onComplete,\n    onDisappearanceComplete\n  ]);\n\n  return (\n    <div ref={ref} className={`invisible ${className}`} {...props}>\n      {children}\n    </div>\n  );\n};\n\nexport default AnimatedContent;\n"
		}
	],
	"registryDependencies": [],
	"dependencies": [
		"gsap@^3.13.0"
	]
}```

### `public\r\AnimatedContent-TS-CSS.json`
```
{
	"$schema": "https://ui.shadcn.com/schema/registry-item.json",
	"name": "AnimatedContent-TS-CSS",
	"title": "AnimatedContent",
	"description": "Wrapper that animates any children on scroll or mount with configurable direction, distance, duration, easing and disappear options.",
	"type": "registry:component",
	"files": [
		{
			"type": "registry:component",
			"path": "AnimatedContent/AnimatedContent.tsx",
			"content": "import React, { useRef, useEffect } from 'react';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\n\ngsap.registerPlugin(ScrollTrigger);\n\ninterface AnimatedContentProps extends React.HTMLAttributes<HTMLDivElement> {\n  children: React.ReactNode;\n  container?: Element | string | null;\n  distance?: number;\n  direction?: 'vertical' | 'horizontal';\n  reverse?: boolean;\n  duration?: number;\n  ease?: string;\n  initialOpacity?: number;\n  animateOpacity?: boolean;\n  scale?: number;\n  threshold?: number;\n  delay?: number;\n  disappearAfter?: number;\n  disappearDuration?: number;\n  disappearEase?: string;\n  onComplete?: () => void;\n  onDisappearanceComplete?: () => void;\n}\n\nconst AnimatedContent: React.FC<AnimatedContentProps> = ({\n  children,\n  container,\n  distance = 100,\n  direction = 'vertical',\n  reverse = false,\n  duration = 0.8,\n  ease = 'power3.out',\n  initialOpacity = 0,\n  animateOpacity = true,\n  scale = 1,\n  threshold = 0.1,\n  delay = 0,\n  disappearAfter = 0,\n  disappearDuration = 0.5,\n  disappearEase = 'power3.in',\n  onComplete,\n  onDisappearanceComplete,\n  className = '',\n  style,\n  ...props\n}) => {\n  const ref = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {\n    const el = ref.current;\n    if (!el) return;\n\n    let scrollerTarget: Element | string | null = container || document.getElementById('snap-main-container') || null;\n\n    if (typeof scrollerTarget === 'string') {\n      scrollerTarget = document.querySelector(scrollerTarget);\n    }\n\n    const axis = direction === 'horizontal' ? 'x' : 'y';\n    const offset = reverse ? -distance : distance;\n    const startPct = (1 - threshold) * 100;\n\n    gsap.set(el, {\n      [axis]: offset,\n      scale,\n      opacity: animateOpacity ? initialOpacity : 1,\n      visibility: 'visible'\n    });\n\n    const tl = gsap.timeline({\n      paused: true,\n      delay,\n      onComplete: () => {\n        if (onComplete) onComplete();\n\n        if (disappearAfter > 0) {\n          gsap.to(el, {\n            [axis]: reverse ? distance : -distance,\n            scale: 0.8,\n            opacity: animateOpacity ? initialOpacity : 0,\n            delay: disappearAfter,\n            duration: disappearDuration,\n            ease: disappearEase,\n            onComplete: () => onDisappearanceComplete?.()\n          });\n        }\n      }\n    });\n\n    tl.to(el, {\n      [axis]: 0,\n      scale: 1,\n      opacity: 1,\n      duration,\n      ease\n    });\n\n    const st = ScrollTrigger.create({\n      trigger: el,\n      scroller: scrollerTarget || window,\n      start: `top ${startPct}%`,\n      once: true,\n      onEnter: () => tl.play()\n    });\n\n    return () => {\n      st.kill();\n      tl.kill();\n    };\n  }, [\n    container,\n    distance,\n    direction,\n    reverse,\n    duration,\n    ease,\n    initialOpacity,\n    animateOpacity,\n    scale,\n    threshold,\n    delay,\n    disappearAfter,\n    disappearDuration,\n    disappearEase,\n    onComplete,\n    onDisappearanceComplete\n  ]);\n\n  return (\n    <div ref={ref} className={className} style={{ visibility: 'hidden', ...style }} {...props}>\n      {children}\n    </div>\n  );\n};\n\nexport default AnimatedContent;\n"
		}
	],
	"registryDependencies": [],
	"dependencies": [
		"gsap@^3.13.0"
	]
}```

### `public\r\AnimatedContent-TS-TW.json`
```
{
	"$schema": "https://ui.shadcn.com/schema/registry-item.json",
	"name": "AnimatedContent-TS-TW",
	"title": "AnimatedContent",
	"description": "Wrapper that animates any children on scroll or mount with configurable direction, distance, duration, easing and disappear options.",
	"type": "registry:component",
	"files": [
		{
			"type": "registry:component",
			"path": "AnimatedContent/AnimatedContent.tsx",
			"content": "import React, { useRef, useEffect } from 'react';\nimport { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\n\ngsap.registerPlugin(ScrollTrigger);\n\ninterface AnimatedContentProps extends React.HTMLAttributes<HTMLDivElement> {\n  children: React.ReactNode;\n  container?: Element | string | null;\n  distance?: number;\n  direction?: 'vertical' | 'horizontal';\n  reverse?: boolean;\n  duration?: number;\n  ease?: string;\n  initialOpacity?: number;\n  animateOpacity?: boolean;\n  scale?: number;\n  threshold?: number;\n  delay?: number;\n  disappearAfter?: number;\n  disappearDuration?: number;\n  disappearEase?: string;\n  onComplete?: () => void;\n  onDisappearanceComplete?: () => void;\n}\n\nconst AnimatedContent: React.FC<AnimatedContentProps> = ({\n  children,\n  container,\n  distance = 100,\n  direction = 'vertical',\n  reverse = false,\n  duration = 0.8,\n  ease = 'power3.out',\n  initialOpacity = 0,\n  animateOpacity = true,\n  scale = 1,\n  threshold = 0.1,\n  delay = 0,\n  disappearAfter = 0,\n  disappearDuration = 0.5,\n  disappearEase = 'power3.in',\n  onComplete,\n  onDisappearanceComplete,\n  className = '',\n  ...props\n}) => {\n  const ref = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {\n    const el = ref.current;\n    if (!el) return;\n\n    let scrollerTarget: Element | string | null = container || document.getElementById('snap-main-container') || null;\n\n    if (typeof scrollerTarget === 'string') {\n      scrollerTarget = document.querySelector(scrollerTarget);\n    }\n\n    const axis = direction === 'horizontal' ? 'x' : 'y';\n    const offset = reverse ? -distance : distance;\n    const startPct = (1 - threshold) * 100;\n\n    gsap.set(el, {\n      [axis]: offset,\n      scale,\n      opacity: animateOpacity ? initialOpacity : 1,\n      visibility: 'visible'\n    });\n\n    const tl = gsap.timeline({\n      paused: true,\n      delay,\n      onComplete: () => {\n        if (onComplete) onComplete();\n        if (disappearAfter > 0) {\n          gsap.to(el, {\n            [axis]: reverse ? distance : -distance,\n            scale: 0.8,\n            opacity: animateOpacity ? initialOpacity : 0,\n            delay: disappearAfter,\n            duration: disappearDuration,\n            ease: disappearEase,\n            onComplete: () => onDisappearanceComplete?.()\n          });\n        }\n      }\n    });\n\n    tl.to(el, {\n      [axis]: 0,\n      scale: 1,\n      opacity: 1,\n      duration,\n      ease\n    });\n\n    const st = ScrollTrigger.create({\n      trigger: el,\n      scroller: scrollerTarget || window,\n      start: `top ${startPct}%`,\n      once: true,\n      onEnter: () => tl.play()\n    });\n\n    return () => {\n      st.kill();\n      tl.kill();\n    };\n  }, [\n    container,\n    distance,\n    direction,\n    reverse,\n    duration,\n    ease,\n    initialOpacity,\n    animateOpacity,\n    scale,\n    threshold,\n    delay,\n    disappearAfter,\n    disappearDuration,\n    disappearEase,\n    onComplete,\n    onDisappearanceComplete\n  ]);\n\n  return (\n    <div ref={ref} className={`invisible ${className}`} {...props}>\n      {children}\n    </div>\n  );\n};\n\nexport default AnimatedContent;\n"
		}
	],
	"registryDependencies": [],
	"dependencies": [
		"gsap@^3.13.0"
	]
}```

### `public\r\AnimatedList-JS-CSS.json`
```
{
	"$schema": "https://ui.shadcn.com/schema/registry-item.json",
	"name": "AnimatedList-JS-CSS",
	"title": "AnimatedList",
	"description": "List items enter with staggered motion variants for polished reveals.",
	"type": "registry:component",
	"files": [
		{
			"type": "registry:component",
			"path": "AnimatedList/AnimatedList.css",
			"content": ".scroll-list-container {\n  position: relative;\n  width: 500px;\n}\n\n.scroll-list {\n  max-height: 400px;\n  overflow-y: auto;\n  padding: 16px;\n}\n\n.scroll-list::-webkit-scrollbar {\n  width: 8px;\n}\n\n.scroll-list::-webkit-scrollbar-track {\n  background: #120F17;\n}\n\n.scroll-list::-webkit-scrollbar-thumb {\n  background: #2F293A;\n  border-radius: 4px;\n}\n\n.no-scrollbar::-webkit-scrollbar {\n  display: none;\n}\n\n.no-scrollbar {\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n}\n\n.item {\n  padding: 16px;\n  background-color: #2F293A;\n  border-radius: 8px;\n  margin-bottom: 1rem;\n}\n\n.item.selected {\n  background-color: #2F293A;\n}\n\n.item-text {\n  color: white;\n  margin: 0;\n}\n\n.top-gradient {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 50px;\n  background: linear-gradient(to bottom, #120F17, transparent);\n  pointer-events: none;\n  transition: opacity 0.3s ease;\n}\n\n.bottom-gradient {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 100px;\n  background: linear-gradient(to top, #120F17, transparent);\n  pointer-events: none;\n  transition: opacity 0.3s ease;\n}\n"
		},
		{
			"type": "registry:component",
			"path": "AnimatedList/AnimatedList.jsx",
			"content": "import { useRef, useState, useEffect, useCallback } from 'react';\nimport { motion, useInView } from 'motion/react';\nimport './AnimatedList.css';\n\nconst AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }) => {\n  const ref = useRef(null);\n  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });\n  return (\n    <motion.div\n      ref={ref}\n      data-index={index}\n      onMouseEnter={onMouseEnter}\n      onClick={onClick}\n      initial={{ scale: 0.7, opacity: 0 }}\n      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}\n      transition={{ duration: 0.2, delay }}\n      style={{ marginBottom: '1rem', cursor: 'pointer' }}\n    >\n      {children}\n    </motion.div>\n  );\n};\n\nconst AnimatedList = ({\n  items = [\n    'Item 1',\n    'Item 2',\n    'Item 3',\n    'Item 4',\n    'Item 5',\n    'Item 6',\n    'Item 7',\n    'Item 8',\n    'Item 9',\n    'Item 10',\n    'Item 11',\n    'Item 12',\n    'Item 13',\n    'Item 14',\n    'Item 15'\n  ],\n  onItemSelect,\n  showGradients = true,\n  enableArrowNavigation = true,\n  className = '',\n  itemClassName = '',\n  displayScrollbar = true,\n  initialSelectedIndex = -1\n}) => {\n  const listRef = useRef(null);\n  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);\n  const [keyboardNav, setKeyboardNav] = useState(false);\n  const [topGradientOpacity, setTopGradientOpacity] = useState(0);\n  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);\n\n  const handleItemMouseEnter = useCallback(index => {\n    setSelectedIndex(index);\n  }, []);\n\n  const handleItemClick = useCallback(\n    (item, index) => {\n      setSelectedIndex(index);\n      if (onItemSelect) {\n        onItemSelect(item, index);\n      }\n    },\n    [onItemSelect]\n  );\n\n  const handleScroll = useCallback(e => {\n    const { scrollTop, scrollHeight, clientHeight } = e.target;\n    setTopGradientOpacity(Math.min(scrollTop / 50, 1));\n    const bottomDistance = scrollHeight - (scrollTop + clientHeight);\n    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));\n  }, []);\n\n  useEffect(() => {\n    if (!enableArrowNavigation) return;\n    const handleKeyDown = e => {\n      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {\n        e.preventDefault();\n        setKeyboardNav(true);\n        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));\n      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {\n        e.preventDefault();\n        setKeyboardNav(true);\n        setSelectedIndex(prev => Math.max(prev - 1, 0));\n      } else if (e.key === 'Enter') {\n        if (selectedIndex >= 0 && selectedIndex < items.length) {\n          e.preventDefault();\n          if (onItemSelect) {\n            onItemSelect(items[selectedIndex], selectedIndex);\n          }\n        }\n      }\n    };\n\n    window.addEventListener('keydown', handleKeyDown);\n    return () => window.removeEventListener('keydown', handleKeyDown);\n  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);\n\n  useEffect(() => {\n    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;\n    const container = listRef.current;\n    const selectedItem = container.querySelector(`[data-index=\"${selectedIndex}\"]`);\n    if (selectedItem) {\n      const extraMargin = 50;\n      const containerScrollTop = container.scrollTop;\n      const containerHeight = container.clientHeight;\n      const itemTop = selectedItem.offsetTop;\n      const itemBottom = itemTop + selectedItem.offsetHeight;\n      if (itemTop < containerScrollTop + extraMargin) {\n        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });\n      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {\n        container.scrollTo({\n          top: itemBottom - containerHeight + extraMargin,\n          behavior: 'smooth'\n        });\n      }\n    }\n    setKeyboardNav(false);\n  }, [selectedIndex, keyboardNav]);\n\n  return (\n    <div className={`scroll-list-container ${className}`}>\n      <div ref={listRef} className={`scroll-list ${!displayScrollbar ? 'no-scrollbar' : ''}`} onScroll={handleScroll}>\n        {items.map((item, index) => (\n          <AnimatedItem\n            key={index}\n            delay={0.1}\n            index={index}\n            onMouseEnter={() => handleItemMouseEnter(index)}\n            onClick={() => handleItemClick(item, index)}\n          >\n            <div className={`item ${selectedIndex === index ? 'selected' : ''} ${itemClassName}`}>\n              <p className=\"item-text\">{item}</p>\n            </div>\n          </AnimatedItem>\n        ))}\n      </div>\n      {showGradients && (\n        <>\n          <div className=\"top-gradient\" style={{ opacity: topGradientOpacity }}></div>\n          <div className=\"bottom-gradient\" style={{ opacity: bottomGradientOpacity }}></div>\n        </>\n      )}\n    </div>\n  );\n};\n\nexport default AnimatedList;\n"
		}
	],
	"registryDependencies": [],
	"dependencies": [
		"motion@^12.23.12"
	]
}```
