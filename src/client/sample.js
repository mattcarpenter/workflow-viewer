module.exports = {
  "login": {
    "analytics-pageview": {
      "callbacks": {
        "success": [
          {
            "value": "prompt"
          }
        ]
      },
      "source": "./steps/analytics-pageview",
      "subflows": []
    },
    "prompt": {
      "callbacks": {
        "cancel": [
          {
            "value": "close"
          }
        ],
        "success": [
          {
            "condition": "this.data.action === 'register' && isFamilyFriendly",
            "value": "register-family-friendly"
          },
          {
            "condition": "this.data.action === 'register' && !isFamilyFriendly",
            "value": "register-general-audience"
          },
          {
            "condition": "this.data.action === 'login'",
            "value": "execute"
          },
          {
            "condition": "this.data.action === 'social-login'",
            "value": "social-login"
          },
          {
            "condition": "this.data.action === 'resolve-mase'",
            "value": "mase-send-email"
          }
        ]
      },
      "source": "./steps/prompt",
      "subflows": []
    },
    "execute": {
      "callbacks": {
        "success": [
          {
            "value": "create-session"
          }
        ],
        "failure": [
          {
            "value": "parse-errors"
          }
        ]
      },
      "source": "../shared/steps/execute-login",
      "subflows": []
    },
    "social-login": {
      "callbacks": {
        "success": [
          {
            "value": "create-session"
          }
        ],
        "failure": [
          {
            "value": "parse-errors"
          }
        ]
      },
      "source": "./steps/social-login",
      "subflows": [
        {
          "name": "socialLogin",
          "step": "execute-social-login",
          "condition": null
        }
      ]
    },
    "create-session": {
      "callbacks": {
        "success": [
          {
            "value": "reload-on-auth-change"
          }
        ]
      },
      "source": "../shared/steps/create-session",
      "subflows": []
    },
    "reload-on-auth-change": {
      "callbacks": {
        "success": [
          {
            "value": "analytics-link"
          }
        ]
      },
      "source": "../shared/steps/reload-on-auth-change",
      "subflows": []
    },
    "analytics-link": {
      "callbacks": {
        "success": [
          {
            "value": "complete"
          }
        ]
      },
      "source": "./steps/analytics-link",
      "subflows": []
    },
    "parse-errors": {
      "callbacks": {
        "success": [
          {
            "condition": "errors.isGating",
            "value": "gating"
          },
          {
            "condition": "errors.isIPAS",
            "value": "ipas"
          },
          {
            "condition": "errors.isPil2",
            "value": "pil2"
          },
          {
            "condition": "errors.isLoginSetPassword",
            "value": "set-password"
          },
          {
            "condition": "errors.isPPU",
            "value": "ppu"
          },
          {
            "condition": "errors.isServiceError",
            "value": "service-error"
          },
          {
            "condition": "errors.other",
            "value": "prompt"
          }
        ]
      },
      "source": "../shared/steps/parse-errors",
      "subflows": []
    },
    "register-family-friendly": {
      "callbacks": {},
      "source": "./steps/register-family-friendly",
      "subflows": [
        {
          "name": "register",
          "step": null,
          "condition": null
        }
      ]
    },
    "register-general-audience": {
      "callbacks": {},
      "source": "./steps/register-general-audience",
      "subflows": [
        {
          "name": "register-social",
          "step": null,
          "condition": null
        }
      ]
    },
    "set-password": {
      "callbacks": {
        "success": [
          {
            "condition": null,
            "value": null
          }
        ],
        "cancel": [
          {
            "value": "close"
          }
        ]
      },
      "source": "./steps/set-password-confirmation-prompt",
      "subflows": []
    },
    "set-password-send-email": {
      "callbacks": {
        "success": [
          {
            "value": "set-password-success"
          }
        ],
        "failure": [
          {
            "value": "set-password-success"
          }
        ]
      },
      "source": "../shared/steps/execute-recover-password",
      "subflows": []
    },
    "set-password-success": {
      "callbacks": {
        "success": [
          {
            "value": "prompt"
          }
        ],
        "cancel": [
          {
            "value": "close"
          }
        ]
      },
      "source": "./steps/set-password-success",
      "subflows": []
    },
    "gating": {
      "callbacks": {
        "cancel": [
          {
            "value": "close"
          }
        ]
      },
      "source": "../shared/steps/gating",
      "subflows": [
        {
          "name": "gating",
          "step": "ensure-logged-out",
          "condition": null
        }
      ]
    },
    "ipas": {
      "callbacks": {
        "success": [
          {
            "value": "create-session"
          }
        ],
        "failure": [
          {
            "value": "parse-errors"
          }
        ],
        "cancel": [
          {
            "value": "close"
          }
        ]
      },
      "source": "../shared/steps/ipas",
      "subflows": [
        {
          "name": "ipas",
          "step": "select-primary-prompt",
          "condition": null
        }
      ]
    },
    "pil2": {
      "callbacks": {
        "cancel": [
          {
            "value": "close"
          }
        ]
      },
      "source": "./steps/pil2",
      "subflows": [
        {
          "name": "pil2",
          "step": "get-parent-email",
          "condition": null
        }
      ]
    },
    "ppu": {
      "callbacks": {
        "success": [
          {
            "value": "create-session"
          }
        ],
        "failure": [
          {
            "value": "parse-errors"
          }
        ]
      },
      "source": "../shared/steps/ppu",
      "subflows": [
        {
          "name": "ppu",
          "step": "prompt",
          "condition": null
        }
      ]
    },
    "mase-send-email": {
      "callbacks": {
        "success": [
          {
            "value": "mase-confirmation-prompt"
          }
        ],
        "failure": [
          {
            "value": "service-error"
          }
        ]
      },
      "source": "./steps/mase-send-email",
      "subflows": []
    },
    "mase-confirmation-prompt": {
      "callbacks": {
        "success": [
          {
            "value": "prompt"
          }
        ]
      },
      "source": "./steps/mase-confirmation-prompt",
      "subflows": []
    },
    "complete": {
      "callbacks": {
        "success": [
          {
            "value": "close"
          }
        ]
      },
      "source": "./steps/complete",
      "subflows": []
    },
    "service-error": {
      "callbacks": {},
      "source": "../shared/steps/service-error",
      "subflows": [
        {
          "name": "serviceError",
          "step": "prompt",
          "condition": null
        }
      ]
    },
    "close": {
      "callbacks": {
        "success": [
          {
            "value": "done"
          }
        ]
      },
      "source": "../shared/steps/close",
      "subflows": []
    }
  },
  "socialLogin": {
    "execute-social-login": {
      "callbacks": {
        "failure": [
          {
            "value": "check-create-gating"
          }
        ],
        "success": [
          {
            "value": "done"
          }
        ]
      },
      "source": "../shared/steps/execute-social-login",
      "subflows": []
    },
    "check-create-gating": {
      "callbacks": {
        "success": [
          {
            "value": "parse-errors"
          }
        ]
      },
      "source": "./steps/check-create-gating",
      "subflows": []
    },
    "parse-errors": {
      "callbacks": {
        "success": [
          {
            "condition": "errors.isPPU",
            "value": "done"
          },
          {
            "condition": "errors.isAccountMappingError || errors.isAuthorizationError",
            "value": "prompt-account-link-login"
          },
          {
            "condition": "this.data.createGated",
            "value": "service-error"
          },
          {
            "condition": "this.data.createGated",
            "value": "prompt-link-or-create"
          },
          {
            "condition": "errors.isAccountMappingNotFoundError",
            "value": "done"
          }
        ]
      },
      "source": "../shared/steps/parse-errors",
      "subflows": []
    },
    "prompt-account-link-login": {
      "callbacks": {
        "success": [
          {
            "condition": "this.data.action === 'account-link-login'",
            "value": "execute-login"
          }
        ],
        "cancel": [
          {
            "value": "close"
          }
        ]
      },
      "source": "./steps/prompt-account-link-login",
      "subflows": []
    },
    "execute-login": {
      "callbacks": {
        "success": [
          {
            "value": "execute-account-linking"
          }
        ],
        "failure": [
          {
            "value": "parse-password-login-errors"
          }
        ]
      },
      "source": "../shared/steps/execute-login",
      "subflows": []
    },
    "parse-password-login-errors": {
      "callbacks": {
        "success": [
          {
            "condition": "errors.isGating || errors.isIPAS || errors.isPil2 || errors.isPPU",
            "value": "done"
          },
          {
            "condition": "errors.isGating || errors.isIPAS || errors.isPil2 || errors.isPPU",
            "value": "prompt-account-link-login"
          }
        ]
      },
      "source": "../shared/steps/parse-errors",
      "subflows": []
    },
    "mase-send-email": {
      "callbacks": {
        "success": [
          {
            "value": "mase-confirmation-prompt"
          }
        ],
        "failure": [
          {
            "value": "service-error"
          }
        ]
      },
      "source": "../login/steps/mase-send-email",
      "subflows": []
    },
    "mase-confirmation-prompt": {
      "callbacks": {
        "success": [
          {
            "value": "prompt-account-link-login"
          }
        ]
      },
      "source": "../login/steps/mase-confirmation-prompt",
      "subflows": []
    },
    "prompt-link-or-create": {
      "callbacks": {},
      "source": "./steps/prompt-link-or-create",
      "subflows": [
        {
          "name": "register-subflow",
          "step": null,
          "condition": null
        }
      ]
    },
    "execute-account-linking": {
      "callbacks": {
        "success": [
          {
            "value": "done"
          }
        ]
      },
      "source": "./steps/execute-account-linking",
      "subflows": []
    },
    "service-error": {
      "callbacks": {},
      "source": "../shared/steps/service-error",
      "subflows": [
        {
          "name": "serviceError",
          "step": "prompt",
          "condition": null
        }
      ]
    },
    "close": {
      "callbacks": {},
      "source": "../shared/steps/close",
      "subflows": []
    }
  },
  "register-subflow": {
    "reload-on-region-mismatch": {
      "callbacks": {
        "success": [
          {
            "value": "prompt-create"
          }
        ]
      },
      "source": "./steps/reload-on-region-mismatch",
      "subflows": []
    },
    "prompt-create": {
      "callbacks": {
        "success": [
          {
            "condition": "this.data.action === 'link-account'",
            "value": "account-link-login"
          },
          {
            "condition": "this.data.action === 'set-legal-country'",
            "value": "galc-subflow"
          },
          {
            "condition": "this.data.action === 'set-social-password'",
            "value": "execute-set-social-password"
          },
          {
            "condition": "this.data.action === 'set-social-password'",
            "value": "execute"
          }
        ],
        "cancel": [
          {
            "value": "close"
          }
        ]
      },
      "source": "./steps/prompt-create",
      "subflows": []
    },
    "execute-set-social-password": {
      "callbacks": {
        "success": [
          {
            "value": "prompt-set-social-password-success"
          }
        ]
      },
      "source": "../shared/steps/execute-recover-password",
      "subflows": []
    },
    "prompt-set-social-password-success": {
      "callbacks": {
        "success": [
          {
            "value": "go-to-login"
          }
        ],
        "cancel": [
          {
            "value": "close"
          }
        ]
      },
      "source": "./steps/prompt-set-social-password-success",
      "subflows": []
    },
    "go-to-login": {
      "callbacks": {},
      "source": "./steps/go-to-login",
      "subflows": [
        {
          "name": "login",
          "step": null,
          "condition": null
        }
      ]
    },
    "galc-subflow": {
      "callbacks": {
        "success": [
          {
            "value": "reload-on-region-mismatch"
          }
        ]
      },
      "source": "./steps/galc-subflow",
      "subflows": [
        {
          "name": "guest-asserted-legal-country",
          "step": null,
          "condition": null
        }
      ]
    },
    "account-link-login": {
      "callbacks": {
        "success": [
          {
            "value": "create-session"
          }
        ]
      },
      "source": "./steps/account-link-login",
      "subflows": [
        {
          "name": "socialLogin",
          "step": "prompt-account-link-login",
          "condition": null
        }
      ]
    },
    "execute": {
      "callbacks": {
        "success": [
          {
            "value": "check-interstitial-enabled"
          }
        ],
        "failure": [
          {
            "value": "parse-errors"
          }
        ]
      },
      "source": "./steps/execute",
      "subflows": []
    },
    "parse-errors": {
      "callbacks": {
        "success": [
          {
            "condition": "errors.isGating",
            "value": "gating"
          },
          {
            "condition": "errors.isPil2",
            "value": "pil2"
          },
          {
            "condition": "errors.isPPU",
            "value": "ppu"
          },
          {
            "condition": "errors.isServiceError || errors.isInvalidRegionError",
            "value": "service-error"
          },
          {
            "condition": "errors.isServiceError || errors.isInvalidRegionError",
            "value": "prompt-create"
          }
        ]
      },
      "source": "../shared/steps/parse-errors",
      "subflows": []
    },
    "gating": {
      "callbacks": {},
      "source": "../shared/steps/gating",
      "subflows": [
        {
          "name": "gating",
          "step": "ensure-logged-out",
          "condition": null
        }
      ]
    },
    "pil2": {
      "callbacks": {
        "cancel": [
          {
            "value": "close"
          }
        ]
      },
      "source": "./steps/pil2",
      "subflows": [
        {
          "name": "pil2",
          "step": "get-parent-email",
          "condition": null
        }
      ]
    },
    "ppu": {
      "callbacks": {
        "success": [
          {
            "value": "create-session"
          }
        ],
        "failure": [
          {
            "value": "parse-errors"
          }
        ]
      },
      "source": "../shared/steps/ppu",
      "subflows": [
        {
          "name": "ppu",
          "step": "prompt",
          "condition": null
        }
      ]
    },
    "service-error": {
      "callbacks": {},
      "source": "../shared/steps/service-error",
      "subflows": [
        {
          "name": "serviceError",
          "step": "prompt",
          "condition": null
        }
      ]
    },
    "check-interstitial-enabled": {
      "callbacks": {
        "success": [
          {
            "condition": "this.data.interstitialEnabled",
            "value": "interstitial"
          },
          {
            "condition": "this.data.interstitialEnabled",
            "value": "analytics"
          }
        ]
      },
      "source": "../shared/steps/check-register-interstitial-enabled",
      "subflows": []
    },
    "analytics": {
      "callbacks": {
        "success": [
          {
            "value": "create-session"
          }
        ]
      },
      "source": "./steps/analytics",
      "subflows": []
    },
    "interstitial": {
      "callbacks": {
        "success": [
          {
            "value": "create-session"
          }
        ]
      },
      "source": "../shared/steps/register-interstitial",
      "subflows": [
        {
          "name": "register-interstitial",
          "step": null,
          "condition": null
        }
      ]
    },
    "create-session": {
      "callbacks": {
        "success": [
          {
            "value": "reload-on-auth-change"
          }
        ],
        "failure": [
          {
            "value": "service-error"
          }
        ]
      },
      "source": "../shared/steps/create-session",
      "subflows": []
    },
    "reload-on-auth-change": {
      "callbacks": {
        "success": [
          {
            "value": "complete"
          }
        ],
        "failure": [
          {
            "value": "service-error"
          }
        ]
      },
      "source": "../shared/steps/reload-on-auth-change",
      "subflows": []
    },
    "complete": {
      "callbacks": {
        "success": [
          {
            "value": "close"
          }
        ]
      },
      "source": "./steps/complete",
      "subflows": []
    },
    "close": {
      "callbacks": {
        "success": [
          {
            "value": "done"
          }
        ]
      },
      "source": "../shared/steps/close",
      "subflows": []
    }
  },
  "register": {
    "check-config": {
      "callbacks": {
        "success": [
          {
            "value": "check-dob-cookie"
          }
        ]
      },
      "source": "./steps/check-config",
      "subflows": []
    },
    "check-dob-cookie": {
      "callbacks": {
        "success": [
          {
            "condition": "this.data.isAgebandGated",
            "value": "ageband-gating"
          },
          {
            "condition": "haveDob",
            "value": "validate-dob"
          },
          {
            "condition": "haveDob",
            "value": null
          }
        ]
      },
      "source": "../shared/steps/check-dob-cookie",
      "subflows": []
    },
    "prompt-dob": {
      "callbacks": {
        "success": [
          {
            "value": "validate-dob"
          }
        ],
        "cancel": [
          {
            "value": "close"
          }
        ]
      },
      "source": "./steps/prompt-dob",
      "subflows": [
        {
          "name": "login",
          "step": "prompt",
          "condition": null
        }
      ]
    },
    "validate-dob": {
      "callbacks": {
        "success": [
          {
            "value": "register-subflow"
          }
        ],
        "failure": [
          {
            "value": "write-ageband-cookie"
          }
        ]
      },
      "source": "./steps/validate-dob",
      "subflows": []
    },
    "write-ageband-cookie": {
      "callbacks": {
        "success": [
          {
            "value": "gating"
          }
        ]
      },
      "source": "./steps/write-ageband-cookie",
      "subflows": []
    },
    "register-subflow": {
      "callbacks": {
        "success": [
          {
            "value": "analytics-link"
          }
        ]
      },
      "source": "../shared/steps/register-subflow",
      "subflows": [
        {
          "name": "register-subflow",
          "step": null,
          "condition": null
        }
      ]
    },
    "gating": {
      "callbacks": {
        "cancel": [
          {
            "value": "done"
          }
        ]
      },
      "source": "../shared/steps/gating",
      "subflows": [
        {
          "name": "gating",
          "step": "ensure-logged-out",
          "condition": null
        }
      ]
    },
    "ageband-gating": {
      "callbacks": {},
      "source": "../shared/steps/ageband-gating",
      "subflows": [
        {
          "name": "gating",
          "step": null,
          "condition": null
        }
      ]
    },
    "analytics-link": {
      "callbacks": {
        "success": [
          {
            "value": "complete"
          }
        ]
      },
      "source": "../shared/steps/close",
      "subflows": []
    },
    "complete": {
      "callbacks": {
        "success": [
          {
            "value": "done"
          }
        ]
      },
      "source": "../shared/steps/close",
      "subflows": []
    },
    "close": {
      "callbacks": {
        "success": [
          {
            "value": "done"
          }
        ]
      },
      "source": "../shared/steps/close",
      "subflows": []
    }
  },
  "gating": {
    "ensure-logged-out": {
      "callbacks": {
        "success": [
          {
            "value": "parse-errors"
          }
        ]
      },
      "source": "../shared/steps/ensure-logged-out",
      "subflows": []
    },
    "parse-errors": {
      "callbacks": {
        "success": [
          {
            "condition": "this.data.errors.isAgebandGating",
            "value": "write-dob-cookie"
          },
          {
            "condition": "this.data.errors.isAgebandGating",
            "value": "prompt"
          }
        ]
      },
      "source": "../shared/steps/parse-errors",
      "subflows": []
    },
    "write-dob-cookie": {
      "callbacks": {
        "success": [
          {
            "value": "prompt"
          }
        ]
      },
      "source": "../shared/steps/write-dob-cookie",
      "subflows": []
    },
    "prompt": {
      "callbacks": {
        "cancel": [
          {
            "value": "close"
          }
        ]
      },
      "source": "./steps/prompt",
      "subflows": []
    },
    "close": {
      "callbacks": {
        "success": [
          {
            "value": "done"
          }
        ]
      },
      "source": "../shared/steps/close",
      "subflows": []
    }
  },
  "ipas": {
    "select-primary-prompt": {
      "callbacks": {
        "cancel": [
          {
            "value": "done"
          }
        ],
        "success": [
          {
            "condition": null,
            "value": null
          }
        ]
      },
      "source": "./steps/select-primary-prompt",
      "subflows": []
    },
    "confirm-primary-prompt": {
      "callbacks": {
        "cancel": [
          {
            "value": "done"
          }
        ],
        "success": [
          {
            "condition": "this.data.action === 'select-primary-account'",
            "value": "select-primary-prompt"
          },
          {
            "condition": "this.data.action === 'confirm-primary-account'",
            "value": "confirm-primary-execute"
          }
        ]
      },
      "source": "./steps/confirm-primary-prompt",
      "subflows": []
    },
    "confirm-primary-execute": {
      "callbacks": {
        "success": [
          {
            "value": "done"
          }
        ],
        "failure": [
          {
            "value": "done"
          }
        ]
      },
      "source": "./steps/confirm-primary-execute",
      "subflows": []
    },
    "send-recovery-email": {
      "callbacks": {
        "success": [
          {
            "condition": null,
            "value": "email-sent-prompt"
          }
        ],
        "failure": [
          {
            "condition": null,
            "value": "email-sent-prompt"
          }
        ]
      },
      "source": "./steps/send-recovery-email",
      "subflows": []
    },
    "email-sent-prompt": {
      "callbacks": {
        "cancel": [
          {
            "value": "done"
          }
        ]
      },
      "source": "./steps/email-sent-prompt",
      "subflows": []
    }
  },
  "pil2": {
    "get-parent-email": {
      "callbacks": {
        "success": [
          {
            "value": "prompt"
          }
        ]
      },
      "source": "./steps/get-parent-email",
      "subflows": []
    },
    "prompt": {
      "callbacks": {
        "success": [
          {
            "condition": "this.data.action === 'sendParentEmail'",
            "value": "send-email"
          }
        ],
        "cancel": [
          {
            "value": "close"
          }
        ]
      },
      "source": "./steps/prompt",
      "subflows": []
    },
    "send-email": {
      "callbacks": {
        "success": [
          {
            "value": "prompt"
          }
        ]
      },
      "source": "./steps/send-email",
      "subflows": []
    },
    "close": {
      "callbacks": {},
      "source": "../shared/steps/close",
      "subflows": []
    }
  },
  "ppu": {
    "prompt": {
      "callbacks": {
        "success": [
          {
            "value": "execute"
          }
        ],
        "failure": [
          {
            "value": "ensure-logged-out"
          }
        ]
      },
      "source": "./steps/prompt",
      "subflows": []
    },
    "execute": {
      "callbacks": {
        "success": [
          {
            "value": "analytics-link"
          }
        ],
        "failure": [
          {
            "value": "parse-errors"
          }
        ]
      },
      "source": "./steps/execute",
      "subflows": []
    },
    "analytics-link": {
      "callbacks": {
        "success": [
          {
            "value": "done"
          }
        ]
      },
      "source": "./steps/analytics-link",
      "subflows": []
    },
    "parse-errors": {
      "callbacks": {
        "success": [
          {
            "condition": "errors.isGating || errors.isPil2 || errors.isIPAS",
            "value": "done"
          },
          {
            "condition": "errors.isGating || errors.isPil2 || errors.isIPAS",
            "value": "prompt"
          }
        ]
      },
      "source": "../shared/steps/parse-errors",
      "subflows": []
    },
    "ensure-logged-out": {
      "callbacks": {
        "success": [
          {
            "value": "close"
          }
        ]
      },
      "source": "../shared/steps/ensure-logged-out",
      "subflows": []
    },
    "close": {
      "callbacks": {},
      "source": "../shared/steps/close",
      "subflows": []
    }
  },
  "serviceError": {
    "prompt": {
      "callbacks": {
        "cancel": [
          {
            "value": "close"
          }
        ]
      },
      "source": "./steps/prompt",
      "subflows": []
    },
    "close": {
      "callbacks": {
        "success": [
          {
            "value": "done"
          }
        ]
      },
      "source": "../shared/steps/close",
      "subflows": []
    }
  }
};
