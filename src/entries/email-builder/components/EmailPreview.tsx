import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { __ } from '@wordpress/i18n';

interface EmailPreviewProps {
  html: string;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ html }) => {
  return (
    <div className="flex-1 bg-gray-100 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{__('Email Preview', 'trigger')}</span>
              <div className="text-sm text-gray-500 font-normal">
                {__('This is how your email will look to recipients', 'trigger')}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white border rounded-lg overflow-hidden">
              {/* Email Header Simulation */}
              <div className="bg-gray-50 border-b px-4 py-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">{__('From:', 'trigger')} your-email@example.com</span>
                    <span>{__('To:', 'trigger')} recipient@example.com</span>
                  </div>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="mt-2">
                  <span className="font-medium text-gray-900">{__('Subject:', 'trigger')} Your Email Subject</span>
                </div>
              </div>

              {/* Email Content */}
              <div className="p-0">
                <iframe
                  srcDoc={html}
                  className="w-full h-[600px] border-0"
                  title={__('Email Preview', 'trigger')}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>

            {/* Preview Controls */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {__('Preview Mode:', 'trigger')}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {__('Desktop', 'trigger')}
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                    {__('Mobile', 'trigger')}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  {__('View HTML', 'trigger')}
                </button>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  {__('Send Test Email', 'trigger')}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};