import { HashRouter, Routes, Route } from "react-router-dom";
import SettingHeader from "@pages/settings/setting-header";
import Connections from "./connections";
import GeneralSettings from "./general-settings";


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
	return <>
		<GeneralSettings />
	</>
};

export default Settings;