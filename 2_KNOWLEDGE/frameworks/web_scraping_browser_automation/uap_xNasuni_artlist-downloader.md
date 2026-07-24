# KI: xNasuni/artlist-downloader

## Overview
Repository with 5 files across 1 directories. Primary language: JavaScript (2 files).

## Tech Stack (from code)
- JavaScript (2 files)
- **Total:** 5 files, 1 directories
- **File types:** .js: 2, .prettierrc: 1, .md: 1

## File Structure
```
  .prettierrc
  LICENSE
  README.md
  artlist-downloader.user.js
  legacy-main.js
```

## Key Source Excerpts
### artlist-downloader.user.js
```javascript
// ==UserScript==
// @name        Artlist DL
// @namespace   http://tampermonkey.net/
// @description Allows you to download artlist.io Music & SFX
// @author      Mia @ github.com/xNasuni
// @match       *://*.artlist.io/*
// @grant       GM_xmlhttpRequest
// @connect     cms-public-artifacts.artlist.io
// @connect     cms-artifacts.artlist.io
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @version     3.0
// @run-at	    document-start
// @updateURL   https://github.com/xNasuni/artlist-downloader/raw/main/artlist-downloader.user.js
// @downloadURL https://github.com/xNasuni/artlist-downloader/raw/main/artlist-downloader.user.js
// @supportURL  https://github.com/xNasuni/artlist-downloader/issues
// ==/UserScript==

const LoadedMusicLists = []
const LoadedSfxLists = []
const LoadedSfxsList = []
const LoadedSongsList = []
const LoadedSstemsLists = []
const ModifiedMusicButtonColor = '#82ff59'
const ModifiedSfxButtonColor = '#ff90bf'
const ErrorButtonColor = '#ff3333'
const UNKNOWN_DATATYPE = '_unknown'
const NEXTRSC_DATATYPE = '_rsc'
const SINGLE_SOUND_EFFECT_DATATYPE = '_ssfx'
const SINGLE_SONG_DATATYPE = '_ssong'
const MUSIC_ALBUM_PAGETYPE = '_amusic'
const SONGS_PAGETYPE = '_songs'
const MUSIC_PAGETYPE = '_music'
const SFXS_PAGETYPE = '_sfxs'
const SFXP_PAGETYPE = '_sfxp'
const SFX_PAGETYPE = '_sfx'
const SONG_STEMS_PAGETYPE = '_sstem'
const oldXMLHttpRequestOpen = unsafeWindow.XMLHttpRequest.prototype.open
const oldFetch = unsafeWindow.f
```

### legacy-main.js
```javascript
// this code no longer works but feel free to look at it

(async function() {
    function DownloadURI(URI) {
        var Element = document.createElement('a')
        Element.href = URI
        Element.download = URI
        document.body.appendChild(Element)
        Element.click()
        Element.remove()
    }

    function GetCurrentAudioURI() {
        if (document.getElementsByTagName('audio')[0].src != '') {
            return document.getElementsByTagName('audio')[0].src
        } else {
            return document.getElementsByTagName('audio')[1].src
        }
    }

    var CurrentAudioURI = GetCurrentAudioURI()
    
    DownloadURI(CurrentAudioURI)
})()

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 0/100 · **Auto-apply:** False
- **Evidence:** none (kept as reference)
- **All scores:** {'seosona-os': 0, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
