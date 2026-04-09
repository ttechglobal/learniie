// lib/claude/client.js
import Anthropic from '@anthropic-ai/sdk'

// The SDK automatically reads ANTHROPIC_API_KEY from process.env
export const claude = new Anthropic()
