import { Card } from '@/components/Card';
import Link from 'next/link';

export default function CrisisResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Crisis Resources
        </h1>
        <p className="text-gray-600">
          If you are experiencing a crisis, please use these resources immediately.
        </p>
      </div>

      <div className="space-y-4">
        <Card className="border-l-4 border-l-red-600">
          <h2 className="text-xl font-semibold text-mulligan-warm-gray mb-3">
            🚨 Immediate Emergency
          </h2>
          <p className="text-gray-700 mb-4">
            If this is a medical or life-threatening emergency, call 911 or go to your nearest emergency room.
          </p>
          <div className="bg-red-50 px-4 py-3 rounded-lg">
            <p className="font-semibold text-red-800">Emergency: 911</p>
          </div>
        </Card>

        <Card className="border-l-4 border-l-mulligan-orange">
          <h2 className="text-xl font-semibold text-mulligan-warm-gray mb-3">
            📞 On-Site Staff
          </h2>
          <p className="text-gray-700 mb-4">
            Speak with on-site staff immediately for any urgent concerns during your stay at Mulligan Recovery Centers.
          </p>
          <div className="bg-orange-50 px-4 py-3 rounded-lg">
            <p className="font-semibold text-mulligan-orange">
              Staff Phone: [Contact staff directly for number]
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-mulligan-warm-gray mb-3">
            National Crisis Hotlines
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold">988 Suicide & Crisis Lifeline</p>
              <p className="text-sm text-gray-600 mb-2">
                Free, confidential support 24/7
              </p>
              <p className="text-mulligan-orange font-medium">Call or text: 988</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold">Crisis Text Line</p>
              <p className="text-sm text-gray-600 mb-2">
                Free, 24/7 crisis support via text
              </p>
              <p className="text-mulligan-orange font-medium">Text HOME to 741741</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold">SAMHSA National Helpline</p>
              <p className="text-sm text-gray-600 mb-2">
                Treatment referral and information service
              </p>
              <p className="text-mulligan-orange font-medium">1-800-662-4357 (HELP)</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold">Veterans Crisis Line</p>
              <p className="text-sm text-gray-600 mb-2">
                Support for veterans and their families
              </p>
              <p className="text-mulligan-orange font-medium">Call: 1-800-273-8255 (Press 1)</p>
              <p className="text-mulligan-orange font-medium">Text: 838255</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-mulligan-warm-gray mb-3">
            Additional Resources
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Your sponsor or support network members</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Local AA/NA meetings (see Meetings section)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Trusted family members or friends</span>
            </li>
          </ul>
        </Card>

        <div className="text-center pt-6">
          <Link
            href="/dashboard"
            className="text-mulligan-orange hover:underline font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
