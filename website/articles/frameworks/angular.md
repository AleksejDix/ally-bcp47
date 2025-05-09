# Angular Implementation Guide

This guide demonstrates how to effectively integrate ally-bcp-47 into your Angular applications for proper language tag validation and management.

## Installation

First, install the ally-bcp-47 package:

```bash
npm install ally-bcp-47
# or
yarn add ally-bcp-47
```

## Basic Component Implementation

Here's a simple example of an Angular component that validates a language tag:

```typescript
// language-input.component.ts
import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { isValid, canonicalizeTag } from "ally-bcp-47";

@Component({
  selector: "app-language-input",
  template: `
    <div>
      <label for="language-input">Language Tag:</label>
      <input
        id="language-input"
        [formControl]="languageTagControl"
        [attr.aria-invalid]="languageTagControl.invalid"
        [attr.aria-describedby]="
          languageTagControl.invalid ? 'language-error' : null
        "
      />
      <div *ngIf="errorMessage" id="language-error" class="error">
        {{ errorMessage }}
      </div>
      <div *ngIf="isValid && canonicalForm" class="success">
        Valid language tag! Canonical form: {{ canonicalForm }}
      </div>
    </div>
  `,
  styles: [
    `
      .error {
        color: red;
        margin-top: 0.25rem;
      }
      .success {
        color: green;
        margin-top: 0.25rem;
      }
    `,
  ],
})
export class LanguageInputComponent {
  languageTagControl = new FormControl("en-US", [
    Validators.required,
    this.languageTagValidator(),
  ]);

  get errorMessage(): string {
    if (this.languageTagControl.hasError("required")) {
      return "Language tag is required";
    }

    if (this.languageTagControl.hasError("invalidLanguageTag")) {
      return `Invalid language tag: ${this.languageTagControl.value}`;
    }

    return "";
  }

  get isValid(): boolean {
    return this.languageTagControl.valid && this.languageTagControl.value;
  }

  get canonicalForm(): string {
    if (!this.isValid) return "";

    try {
      return canonicalizeTag(this.languageTagControl.value);
    } catch {
      return "";
    }
  }

  languageTagValidator() {
    return (control: FormControl): { [key: string]: any } | null => {
      const value = control.value;

      if (!value) {
        return null; // Let required validator handle empty values
      }

      if (!isValid(value)) {
        return { invalidLanguageTag: true };
      }

      return null;
    };
  }
}
```

## Creating a Custom Validator

You can create a reusable validator for use with Angular's reactive forms:

```typescript
// language-tag.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { isValid, isWellFormed } from "ally-bcp-47";

export function validateLanguageTag(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (!isWellFormed(value)) {
      return { malformedLanguageTag: true };
    }

    if (!isValid(value)) {
      return { invalidLanguageTag: true };
    }

    return null;
  };
}
```

## Creating a BCP47 Service

Create an Angular service to encapsulate ally-bcp-47 functionality:

```typescript
// bcp47.service.ts
import { Injectable, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { isValid, isWellFormed, canonicalizeTag, parseTag } from "ally-bcp-47";

@Injectable({
  providedIn: "root",
})
export class BCP47Service {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * Validates a language tag
   */
  isValid(tag: string): boolean {
    return isValid(tag);
  }

  /**
   * Checks if a language tag is well-formed
   */
  isWellFormed(tag: string): boolean {
    return isWellFormed(tag);
  }

  /**
   * Returns the canonical form of a language tag
   */
  canonicalizeTag(tag: string): string {
    if (!this.isWellFormed(tag)) {
      throw new Error("Cannot canonicalize a malformed tag");
    }
    return canonicalizeTag(tag);
  }

  /**
   * Parses a language tag into its component parts
   */
  parseTag(tag: string): any {
    if (!this.isWellFormed(tag)) {
      throw new Error("Cannot parse a malformed tag");
    }
    return parseTag(tag);
  }

  /**
   * Sets the document's language attribute to the canonical form of the tag
   */
  setDocumentLanguage(tag: string): boolean {
    if (!this.isValid(tag)) {
      console.error(`Invalid language tag: ${tag}`);
      return false;
    }

    const canonicalTag = this.canonicalizeTag(tag);
    this.document.documentElement.lang = canonicalTag;

    // Optionally store in localStorage
    localStorage.setItem("preferredLanguage", canonicalTag);

    return true;
  }

  /**
   * Gets the user's preferred language
   */
  getPreferredLanguage(): string {
    // Check localStorage first
    const storedLang = localStorage.getItem("preferredLanguage");
    if (storedLang && this.isValid(storedLang)) {
      return this.canonicalizeTag(storedLang);
    }

    // Try to use browser language
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang && this.isValid(browserLang)) {
      return this.canonicalizeTag(browserLang);
    }

    // Fallback to English
    return "en";
  }
}
```

## Integrating with Angular's Internationalization

If you're using Angular's built-in internationalization (i18n), you can enhance it with ally-bcp-47 for better language tag handling:

```typescript
// app.component.ts
import { Component, OnInit, Inject, LOCALE_ID } from "@angular/core";
import { BCP47Service } from "./bcp47.service";

@Component({
  selector: "app-root",
  template: `
    <div>
      <h1>{{ title }}</h1>
      <app-language-selector
        [currentLanguage]="currentLanguage"
        (languageChange)="onLanguageChange($event)"
      ></app-language-selector>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent implements OnInit {
  title = "My Multilingual App";
  currentLanguage: string;

  constructor(
    private bcp47Service: BCP47Service,
    @Inject(LOCALE_ID) private localeId: string
  ) {
    this.currentLanguage = this.bcp47Service.getPreferredLanguage();
  }

  ngOnInit() {
    // Set the initial document language
    this.bcp47Service.setDocumentLanguage(this.currentLanguage);
  }

  onLanguageChange(langTag: string) {
    if (this.bcp47Service.setDocumentLanguage(langTag)) {
      this.currentLanguage = langTag;

      // In a real app, you might reload the page or update translations
      // window.location.reload();
    }
  }
}
```

## Creating an Accessible Language Selector Component

```typescript
// language-selector.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from "@angular/core";
import { BCP47Service } from "./bcp47.service";

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: "app-language-selector",
  template: `
    <div class="language-switcher">
      <button
        class="language-button"
        [attr.aria-expanded]="isMenuOpen"
        aria-controls="language-menu"
        (click)="toggleMenu($event)"
      >
        <span aria-hidden="true">{{ getCurrentFlag() }}</span>
        <span>{{ getCurrentName() }}</span>
      </button>

      <div
        *ngIf="isMenuOpen"
        id="language-menu"
        role="menu"
        class="language-menu"
      >
        <ul>
          <li *ngFor="let option of languageOptions" role="none">
            <button
              role="menuitem"
              (click)="selectLanguage(option.code)"
              [attr.aria-current]="
                currentLanguage === option.code ? 'true' : null
              "
            >
              <span aria-hidden="true">{{ option.flag }}</span>
              <span [attr.lang]="option.code">{{ option.name }}</span>
            </button>
          </li>
        </ul>

        <form (ngSubmit)="submitCustomTag()" class="custom-language-form">
          <label for="custom-language-input">Custom Language Tag:</label>
          <div class="input-group">
            <input
              id="custom-language-input"
              [(ngModel)]="customTag"
              name="customTag"
              placeholder="e.g., fr-CA"
              [attr.aria-invalid]="!!customTagError"
              [attr.aria-describedby]="
                customTagError ? 'custom-language-error' : null
              "
            />
            <button type="submit">Apply</button>
          </div>
          <p *ngIf="customTagError" id="custom-language-error" class="error">
            {{ customTagError }}
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .language-switcher {
        position: relative;
      }

      .language-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: transparent;
        border: 1px solid currentColor;
        border-radius: 4px;
        cursor: pointer;
      }

      .language-menu {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 100;
        min-width: 200px;
        margin-top: 0.25rem;
        padding: 0.5rem;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .language-menu ul {
        list-style: none;
        padding: 0;
        margin: 0 0 1rem 0;
      }

      .language-menu button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.5rem;
        text-align: left;
        background: transparent;
        border: none;
        cursor: pointer;
      }

      .language-menu button:hover,
      .language-menu button:focus {
        background: #f5f5f5;
      }

      .language-menu button[aria-current="true"] {
        font-weight: bold;
        background: #f0f0f0;
      }

      .custom-language-form {
        padding-top: 0.5rem;
        border-top: 1px solid #eee;
      }

      .input-group {
        display: flex;
        margin-top: 0.25rem;
      }

      .input-group input {
        flex: 1;
      }

      .error {
        color: red;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
    `,
  ],
})
export class LanguageSelectorComponent {
  @Input() currentLanguage: string = "en";
  @Output() languageChange = new EventEmitter<string>();

  isMenuOpen = false;
  customTag = "";
  customTagError = "";

  languageOptions: LanguageOption[] = [
    { code: "en-US", name: "English (US)", flag: "🇺🇸" },
    { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
    { code: "es-ES", name: "Español", flag: "🇪🇸" },
    { code: "fr-FR", name: "Français", flag: "🇫🇷" },
    { code: "de-DE", name: "Deutsch", flag: "🇩🇪" },
    { code: "ja-JP", name: "日本語", flag: "🇯🇵" },
    { code: "zh-Hans-CN", name: "简体中文", flag: "🇨🇳" },
  ];

  constructor(private bcp47Service: BCP47Service) {}

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  selectLanguage(code: string) {
    this.languageChange.emit(code);
    this.isMenuOpen = false;
  }

  submitCustomTag() {
    if (!this.customTag) {
      this.customTagError = "Please enter a language tag";
      return;
    }

    if (!this.bcp47Service.isValid(this.customTag)) {
      this.customTagError = `Invalid language tag: ${this.customTag}`;
      return;
    }

    this.languageChange.emit(this.bcp47Service.canonicalizeTag(this.customTag));
    this.customTag = "";
    this.customTagError = "";
    this.isMenuOpen = false;
  }

  getCurrentFlag(): string {
    const option = this.languageOptions.find(
      (o) => o.code === this.currentLanguage
    );
    return option ? option.flag : "🌐";
  }

  getCurrentName(): string {
    const option = this.languageOptions.find(
      (o) => o.code === this.currentLanguage
    );
    return option ? option.name : this.currentLanguage;
  }

  @HostListener("document:click", ["$event"])
  onClickOutside(event: Event) {
    if (
      this.isMenuOpen &&
      !(event.target as HTMLElement).closest(".language-switcher")
    ) {
      this.isMenuOpen = false;
    }
  }
}
```

## Integration with ngx-translate

If you're using [ngx-translate](https://github.com/ngx-translate/core) for internationalization, you can enhance it with ally-bcp-47:

```typescript
// app.module.ts
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { AppComponent } from "./app.component";
import { LanguageSelectorComponent } from "./language-selector.component";
import { BCP47Service } from "./bcp47.service";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function initializeApp(
  translateService: TranslateService,
  bcp47Service: BCP47Service
) {
  return () => {
    // Get preferred language tag
    const preferredLang = bcp47Service.getPreferredLanguage();

    // For ngx-translate, we need to use just the language part
    const { language } = bcp47Service.parseTag(preferredLang);

    // Set up ngx-translate
    translateService.addLangs(["en", "es", "fr", "de"]);
    translateService.setDefaultLang("en");

    // Use the language part for translations
    translateService.use(language);

    // But set the full canonical tag on the HTML element
    bcp47Service.setDocumentLanguage(preferredLang);
  };
}

@NgModule({
  declarations: [AppComponent, LanguageSelectorComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    BCP47Service,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [TranslateService, BCP47Service],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

With this setup, you need to modify the `AppComponent` to work with ngx-translate:

```typescript
// app.component.ts
import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BCP47Service } from "./bcp47.service";

@Component({
  selector: "app-root",
  template: `
    <div>
      <h1>{{ "TITLE" | translate }}</h1>
      <app-language-selector
        [currentLanguage]="currentLanguage"
        (languageChange)="onLanguageChange($event)"
      ></app-language-selector>
      <div>
        <p>{{ "HELLO_WORLD" | translate }}</p>
      </div>
    </div>
  `,
})
export class AppComponent {
  currentLanguage: string;

  constructor(
    private translate: TranslateService,
    private bcp47Service: BCP47Service
  ) {
    this.currentLanguage = bcp47Service.getPreferredLanguage();
  }

  onLanguageChange(langTag: string) {
    // Set the canonical form of the tag
    const canonicalTag = this.bcp47Service.canonicalizeTag(langTag);
    this.currentLanguage = canonicalTag;

    // Extract the language part for ngx-translate
    const { language } = this.bcp47Service.parseTag(canonicalTag);

    // Update translations
    this.translate.use(language);

    // Update document lang attribute with full tag
    this.bcp47Service.setDocumentLanguage(canonicalTag);
  }
}
```

## Detecting Browser Language

For better user experience, you can detect the user's browser language on application startup:

```typescript
// language-detector.service.ts
import { Injectable } from "@angular/core";
import { BCP47Service } from "./bcp47.service";

@Injectable({
  providedIn: "root",
})
export class LanguageDetectorService {
  constructor(private bcp47Service: BCP47Service) {}

  /**
   * Detects the user's preferred language from browser settings
   * and returns the best matching supported language
   */
  detectPreferredLanguage(
    supportedLanguages: string[] = ["en-US", "es-ES", "fr-FR", "de-DE"]
  ): string {
    // Get browser languages in order of preference
    const browserLanguages = navigator.languages || [
      navigator.language || (navigator as any).userLanguage,
    ];

    // Normalize supported languages to canonical form
    const canonicalSupported = supportedLanguages.map((lang) =>
      this.bcp47Service.isValid(lang)
        ? this.bcp47Service.canonicalizeTag(lang)
        : lang
    );

    // Try to find exact match first
    for (const browserLang of browserLanguages) {
      if (!this.bcp47Service.isValid(browserLang)) continue;

      const canonicalBrowserLang =
        this.bcp47Service.canonicalizeTag(browserLang);

      if (canonicalSupported.includes(canonicalBrowserLang)) {
        return canonicalBrowserLang;
      }
    }

    // Try to match just the language part
    for (const browserLang of browserLanguages) {
      if (!this.bcp47Service.isValid(browserLang)) continue;

      const { language: browserLanguagePart } =
        this.bcp47Service.parseTag(browserLang);

      // Find first supported language with matching language part
      const match = canonicalSupported.find((supportedLang) => {
        const { language: supportedLanguagePart } =
          this.bcp47Service.parseTag(supportedLang);
        return browserLanguagePart === supportedLanguagePart;
      });

      if (match) {
        return match;
      }
    }

    // Fallback to default (first in supported list)
    return canonicalSupported[0];
  }
}
```

## Testing Language Tag Validation

Testing the language tag validation in Angular using Jasmine:

```typescript
// language-tag.validator.spec.ts
import { FormControl } from "@angular/forms";
import { validateLanguageTag } from "./language-tag.validator";

describe("Language Tag Validator", () => {
  it("should return null for valid language tags", () => {
    const control = new FormControl("en-US");
    const validator = validateLanguageTag();

    expect(validator(control)).toBeNull();
  });

  it("should return error for malformed language tags", () => {
    const control = new FormControl("en_US"); // Underscore instead of hyphen
    const validator = validateLanguageTag();

    expect(validator(control)).toEqual({ malformedLanguageTag: true });
  });

  it("should return error for invalid but well-formed language tags", () => {
    const control = new FormControl("xx-YY"); // Well-formed but invalid language code
    const validator = validateLanguageTag();

    expect(validator(control)).toEqual({ invalidLanguageTag: true });
  });

  it("should return null for empty values", () => {
    const control = new FormControl("");
    const validator = validateLanguageTag();

    expect(validator(control)).toBeNull();
  });
});
```

## Conclusion

Integrating ally-bcp-47 into your Angular applications helps ensure proper language tag handling for internationalization and accessibility. By using the patterns shown in this guide, you can:

1. Create custom form validators for language tags
2. Build accessible language selector components
3. Integrate with Angular's i18n system or third-party solutions like ngx-translate
4. Detect and handle user language preferences
5. Ensure proper document language attributes throughout your application

Remember that proper language identification is crucial for accessibility and internationalization, and ally-bcp-47 provides the tools you need to implement it correctly in your Angular applications.
