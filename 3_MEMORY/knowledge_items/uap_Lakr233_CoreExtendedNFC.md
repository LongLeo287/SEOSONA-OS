# KI: Lakr233/CoreExtendedNFC

## Overview
NFC protocol logic for iOS, built on top of CoreNFC.

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 102 files across 35 directories
- **File types:** .swift: 72, .md: 4, .xcconfig: 4, .svg: 3, .json: 3, .yml: 2, .xcstrings: 2

## Documentation Sections
- CoreExtendedNFC
- Why This Exists
- Supported Cards
- Quick Start
- Card Operations
- Installation
- Architecture
- Testing
- Standards
- License
- Sponsor

## Core Structure
```
  .gitignore
  AGENTS.md
  CLAUDE.md
  LICENSE
  Package.swift
  README.md
  .github/
    workflows/
      ios.yml
      pages.yml
  Example/
    Apptisan_CENFC.jpeg
    Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg
    CENFC/
      main.swift
      Application/
        AppDelegate.swift
        AppTheme.swift
        OpenURLRouter.swift
        SceneDelegate.swift
      Backend/
        AppLogger.swift
        AppState.swift
        CardDocument.swift
        DumpRecord.swift
        DumpStore.swift
        NDEFDataRecord.swift
        NDEFDocument.swift
        NDEFStore.swift
        PassportDocument.swift
        PassportRecord.swift
        PassportStore.swift
        PrintRedirection.swift
        ScanRecord.swift
        ScanRecordDocument.swift
        ScanStore.swift
      Configuration/
        Base.xcconfig
        Development.xcconfig
        Release.xcconfig
        Version.xcconfig
      DerivedSources/
        DerivedSourcesReadme.swift
      Extension/
        ConfigurableInfoView.swift
        ConfigurableToggleActionView.swift
        EmptyStateView.swift
        Ext+Array.swift
        Ext+Data.swift
        MainActor+Isolated.swift
        StackScrollController+Edge.swift
        StackScrollController+InfoRow.swift
        StackScrollController+Sections.swift
        UIViewController+DismissKeyboard.swift
        UIViewController+NFCAvailability.swift
      Interface/
        DumpController/
          DumpDetailViewController.swift
          DumpViewController.swift
          NDEFIcon.swift
        LogsController/
          LogsViewController.swift
        MainController/
          PlaceholderViewController.swift
          TabBarController.swift
        NDEFController/
          NDEFDetailViewController.swift
          NDEFViewController.swift
        PassportController/
          PassportDetailViewController.swift
          PassportMRZInputViewController.swift
          PassportViewController+Cell.swift
          PassportViewController.swift
        ScannerController/
          CardDetailViewController.swift
          CardInfoDetailViewController.swift
          RawCommunicationViewController.swift
          ScannerViewController.swift
          TextViewerController.swift
        ToolsController/
          ATQASAKLookupViewController.swift
          AccessBitsDecoderViewController.swift
          CRCCalculatorViewController.swift
          HexConverterViewController.swift
          TLVParserViewController.swift
          Too
```

## Quick Start
```bash
**Ultralight / NTAG**
**DESFire**
**Type 4 NDEF**
**My Number Card (Japan)**
Official applet/data layout reference: `docs/research/my-number-card.html`
**Card Identification (pure logic, no hardware)**
```

## Agent Configuration

--- AGENTS.md ---
# CoreExtendedNFC — Agent Instructions

## What This Project Is

A Swift Package that provides NFC protocol-layer logic for iOS. CoreNFC handles RF transport; this library provides card identification, command construction, memory models, passport/eMRTD reading, and dump orchestration.

Zero external dependencies. Swift 6.2 strict concurrency. iOS 15+.

This project is iOS-only. Do not add `#if canImport(CoreNFC)` or macOS compatibility shims. Validation should target iOS builds only.

## Project Structure

```
Sources/CoreExtendedNFC/
├── Transport/          CoreNFC tag wrappers
│   ├── NFCTransport.swift          NFCTagTransport protocol
│   ├── NFCSessionManager.swift     Session lifecycle (async/await)
│   ├── MiFareTransport.swift       NFCMiFareTag adapter
│   ├── ISO7816Transport.swift      NFCISO7816Tag adapter
│   ├── FeliCaTransport.swift       NFCFeliCaTag adapter
│   └── ISO15693Transport.swift     NFCISO15693Tag adapter
│
├── Protocol/           Pure logic, ZERO CoreNFC imports
│   ├── ISO14443.swift              CRC_A/CRC_B (ISO 14443-3)
│   ├── CardIdentifier.swift        ATQA+SAK → CardType (NXP AN10833)
│   ├── APDUBuilder.swift           ISO 7816-4 APDU construction
│   ├── PassportAPDU.swift          eMRTD APDU builders (ICAO 9303 Part 10)
│   ├── ASN1Parser.swift            BER-TLV parser (ITU-T X.690)
│   └── NFCErrors.swift             NFCError enum
│
├── Cards/
│   ├── MiFareUltralight/  READ/WRITE/FAST_READ/GET_VERSION/PWD_AUTH
│   ├── NTAG/              READ_SIG/READ_CNT, variant detection
│   ├── DESFire/           Native wrapping, AF chaining, app/file ops
│   ├── FeliCa/            Type 3 NDEF, frame assembly
│   ├── ISO15693/          Block read/write, system info
│   ├── Type4/             NDEF via ISO 7816 SELECT/READ BINARY
│   └── Passport/          BAC, PACE, CA, AA, SM, DG parsers (13 files)
│
├── Crypto/             AES-CMAC, ISO 9797 MAC, key derivation, padding, hashing
├── Models/             CardType, CardInfo, MemoryDump, Acc

--- CLAUDE.md ---
AGENTS.md


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
