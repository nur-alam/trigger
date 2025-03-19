import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { __ } from "@wordpress/i18n";
import { ConnectionType } from "./index";
import EditSmtpConfig from "./provider/edit-smtp-config";
import EditSesConfig from "./provider/edit-ses-config";

interface EditConnectionSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	connection: ConnectionType;
}

export function EditConnectionSheet({
	open,
	onOpenChange,
	connection,
}: EditConnectionSheetProps) {

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="sm:max-w-md overflow-y-auto" style={{ zIndex: 999999 }}>
				<SheetHeader>
					<SheetTitle>{__("Edit Connection", "trigger")}</SheetTitle>
					<SheetDescription>
						{__("Update your email connection settings.", "trigger")}
					</SheetDescription>
				</SheetHeader>

				{connection.provider === "smtp" && (
					<>
						<EditSmtpConfig connection={connection} />
					</>
				)}

				{connection.provider === "ses" && (
					<>
						<EditSesConfig connection={connection} />
					</>
				)}
			</SheetContent>
		</Sheet >
	);
} 