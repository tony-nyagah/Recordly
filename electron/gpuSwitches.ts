export interface GpuSwitches {
	useAngle?: string;
	useGl?: string;
	disableFeatures?: string[];
}

// Let Chromium select its supported ANGLE/GL implementation by default. Forcing
// native EGL on X11 makes the GPU process exit before preview or export starts
// ("Requested GL implementation (gl=egl-gles2,angle=none) not found").
// Set RECORDLY_FORCE_EGL=1 to opt back in.
export function shouldForceLinuxEgl(env: NodeJS.ProcessEnv): boolean {
	const requested = env.RECORDLY_FORCE_EGL?.trim().toLowerCase();
	return requested === "1" || requested === "true";
}

export function getGpuSwitches(
	platform: NodeJS.Platform,
	env: NodeJS.ProcessEnv = process.env,
): GpuSwitches {
	if (platform === "darwin") {
		return {
			useAngle: "metal",
			disableFeatures: ["MacCatapLoopbackAudioForScreenShare"],
		};
	}

	if (platform === "win32") {
		return { useAngle: "d3d11" };
	}

	if (platform === "linux") {
		return {
			useGl: shouldForceLinuxEgl(env) ? "egl" : undefined,
			disableFeatures: ["VaapiVideoDecoder", "VaapiVideoEncoder"],
		};
	}

	return {};
}
