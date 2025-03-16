import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { __ } from "@wordpress/i18n";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ConnectionForm from "@/pages/settings/connections/connection-form";
const emailProviders = [
	{
		id: "ses",
		name: "Amazon SES",
		logo: "/wp-content/plugins/trigger/assets/images/aws-logo.png",
	},
	{
		id: "brevo",
		name: "Brevo (Sendinblue)",
		logo: "/wp-content/plugins/trigger/assets/images/brevo-logo.png",
	},
	{
		id: "elastic",
		name: "Elastic Email",
		logo: "/wp-content/plugins/trigger/assets/images/elastic-logo.png",
	},
	{
		id: "mailgun",
		name: "Mailgun",
		logo: "/wp-content/plugins/trigger/assets/images/mailgun-logo.png",
	},
	{
		id: "mailjet",
		name: "Mailjet",
		logo: "/wp-content/plugins/trigger/assets/images/mailjet-logo.png",
	},
	{
		id: "phpmail",
		name: "PHP Mail",
		logo: "/wp-content/plugins/trigger/assets/images/php-logo.png",
	},
	{
		id: "postmark",
		name: "Postmark",
		logo: "/wp-content/plugins/trigger/assets/images/postmark-logo.png",
	},
	{
		id: "sendgrid",
		name: "SendGrid",
		logo: "/wp-content/plugins/trigger/assets/images/sendgrid-logo.png",
	},
	{
		id: "smtp2go",
		name: "SMTP2GO",
		logo: "/wp-content/plugins/trigger/assets/images/smtp2go-logo.png",
	},
	{
		id: "sparkpost",
		name: "SparkPost",
		logo: "/wp-content/plugins/trigger/assets/images/sparkpost-logo.png",
	},
	{
		id: "smtp",
		name: "Other SMTP Provider",
		logo: "/wp-content/plugins/trigger/assets/images/smtp-logo.png",
	},
	{
		id: "gmail",
		name: "Gmail",
		logo: "/wp-content/plugins/trigger/assets/images/gmail-logo.png",
		badge: "Planned",
	},
];

const AddConnection = () => {
	return (
		<ConnectionForm />
	);
};

export default AddConnection;