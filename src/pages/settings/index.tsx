import { HashRouter, Routes, Route } from "react-router-dom";
import SettingHeader from "@pages/settings/setting-header";
import GeneralSettings from "@pages/settings/general-settings";
import Connections from "@pages/settings/connections";
import AddConnection from "./connections/add-connection";

interface MenuItem {
	id: string;
	label: string;
	path: string;
	badge?: string;
}

const menuItems: MenuItem[] = [
	{ id: "connections", label: "Connections", path: "/connections" },
	{ id: "general", label: "General", path: "/general" },
	// { id: "add-connection", label: "Add Connection", path: "/add-connection", badge: "Coming Soon" },
];

const Settings = () => {
	return (
		<HashRouter>
			<SettingHeader menuItems={menuItems} />
			<Routes>
				<Route path="/" element={<Connections />} />
				<Route path="/connections" element={<Connections />} />
				<Route path="/general" element={<GeneralSettings />} />
				<Route path="/add-connection" element={<AddConnection />} />
			</Routes>
		</HashRouter>
	);
};

export default Settings;