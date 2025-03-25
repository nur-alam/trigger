
import { ConnectionType } from "@/pages/settings/connections/index";
import { SmtpSendTestMail } from "./send-test-mail/SmtpSendTestMail";
import { AwsSendTestMail } from "./send-test-mail/AwsSendTestMail";

interface TestEmailSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	connection: ConnectionType;
}

export function TestEmailSheet({ open, onOpenChange, connection }: TestEmailSheetProps) {

	return (
		<>
			{connection.provider === "smtp" && <SmtpSendTestMail open={open} onOpenChange={onOpenChange} connection={connection} />}
			{connection.provider === "ses" && <AwsSendTestMail open={open} onOpenChange={onOpenChange} connection={connection} />}
		</>
	);
}