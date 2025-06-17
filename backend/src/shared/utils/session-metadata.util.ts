import type { Request } from "express"
import { lookup } from "geoip-lite"
import * as countries from "i18n-iso-countries"
import * as requestIp from "request-ip"

import type { SessionMetadata } from "../types/session-metadata.types"

import { IS_DEV_ENV } from "./is-dev.util"

import DeviceDetector = require("device-detector-js")

export const getSessionMetadata = (
	req: Request,
	userAgent: string,
): SessionMetadata => {
	const ip = IS_DEV_ENV ? "89.144.204.33" : requestIp.getClientIp(req)

	const device = new DeviceDetector().parse(userAgent)
	const location = lookup(ip!)

	return {
		location: {
			country: countries.getName(location?.country || "", "en") || "Unknown",
			city: location?.city || "Unknown",
			latidute: location?.ll[0] || 0,
			longitude: location?.ll[1] || 0,
		},
		device: {
			browser: device.client?.name || "Unknown",
			os: device.os?.name || "Unknown",
			type: device.device?.type || "Unknown",
		},
		ip: ip || "",
	}
}
