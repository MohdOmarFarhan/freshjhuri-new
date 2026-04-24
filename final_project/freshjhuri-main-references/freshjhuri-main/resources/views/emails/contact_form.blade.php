<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #0088cc; /* Change to your brand color */
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .info-group {
            margin-bottom: 15px;
            border-bottom: 1px solid #eeeeee;
            padding-bottom: 15px;
        }
        .info-group:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #666666;
            display: block;
            margin-bottom: 5px;
        }
        .value {
            font-size: 16px;
            color: #333333;
            line-height: 1.5;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #999999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div style="padding: 20px;">
        <div class="container">
            <div class="header">
                <h1>New Contact Message</h1>
            </div>
            
            <div class="content">
                <div class="info-group">
                    <span class="label">From:</span>
                    <span class="value">{{ $data['email'] }}</span>
                </div>

                <div class="info-group">
                    <span class="label">Phone:</span>
                    <span class="value">{{ $data['phone'] }}</span>
                </div>

                <div class="info-group">
                    <span class="label">WhatsApp:</span>
                    <span class="value">{{ $data['whatsapp'] }}</span>
                </div>

                @if(!empty($data['message_en']))
                <div class="info-group">
                    <span class="label">Message (English):</span>
                    <div class="value">{{ $data['message_en'] }}</div>
                </div>
                @endif

                @if(!empty($data['message_bn']))
                <div class="info-group">
                    <span class="label">Message (Bengali):</span>
                    <div class="value">{{ $data['message_bn'] }}</div>
                </div>
                @endif
            </div>

            <div class="footer">
                <p>This email was sent from the contact form on your website.</p>
                <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>