"use client";

import { authClient } from '@/app/lib/auth-client';
import { SUPPORTED_OAUTH_PROVIDER_DETAILS, SUPPORTED_OAUTH_PROVIDERS } from '@/app/lib/o-auth-provider'
import { BetterAuthActionButton } from '@/components/auth/better-auth-action';
import React from 'react'

const SocialAuthButtons = () => {
  return (
    SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
        const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon
        return (
            <BetterAuthActionButton
                variant="outline"
                key={provider}
                action={() => {
                return authClient.signIn.social({
                    provider,
                    callbackURL: "/",
                })
                }}
            >
                <Icon />
                {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
            </BetterAuthActionButton>
        )
    })
  )
}

export default SocialAuthButtons
