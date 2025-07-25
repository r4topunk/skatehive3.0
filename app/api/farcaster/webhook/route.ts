import { NextRequest, NextResponse } from 'next/server';
import { processFarcasterWebhook } from '@/lib/farcaster/token-store';
import { FarcasterSignature } from '@/types/farcaster';

export async function POST(request: NextRequest) {
    try {
        const signature: FarcasterSignature = await request.json();
        console.log('[Webhook] Received Farcaster signature:', JSON.stringify(signature));

        // Validate the signature format
        if (!signature.header || !signature.payload || !signature.signature) {
            console.error('[Webhook] Invalid payload format:', signature);
            return NextResponse.json(
                { error: 'Invalid webhook payload format' },
                { status: 400 }
            );
        }

        // Process the webhook
        const success = await processFarcasterWebhook(signature);
        console.log('[Webhook] processFarcasterWebhook result:', success);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: 'Failed to process webhook' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('[Webhook] Farcaster webhook error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Handle GET requests (for testing)
export async function GET() {
    return NextResponse.json({
        message: 'SkateHive Farcaster webhook endpoint',
        timestamp: new Date().toISOString()
    });
}
