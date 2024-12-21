import { ServerConfig } from '../server-configs'

export type ValidationError = {
	field: string
	message: string
}

export type ValidationResult = {
	isValid: boolean
	errors: ValidationError[]
}

export function validateServerConfig(
	name: string,
	config: ServerConfig
): ValidationResult {
	const errors: ValidationError[] = []

	// Required fields validation
	if (!config.icon) {
		errors.push({
			field: 'icon',
			message: `Server ${name} is missing required icon field`
		})
	}

	if (!config.description) {
		errors.push({
			field: 'description',
			message: `Server ${name} is missing required description field`
		})
	}

	if (!config.docsUrl) {
		errors.push({
			field: 'docsUrl',
			message: `Server ${name} is missing required docsUrl field`
		})
	}

	// URL format validation
	if (config.docsUrl && !isValidUrl(config.docsUrl)) {
		errors.push({
			field: 'docsUrl',
			message: `Server ${name} has invalid docsUrl format`
		})
	}

	// Command validation
	if (config.command) {
		if (typeof config.command !== 'string') {
			errors.push({
				field: 'command',
				message: `Server ${name} command must be a string`
			})
		}
		if (!config.args || !Array.isArray(config.args)) {
			errors.push({
				field: 'args',
				message: `Server ${name} with command must include args array`
			})
		}
	}

	// Environment variables validation
	if (config.env) {
		Object.entries(config.env).forEach(([key, value]) => {
			if (typeof key !== 'string' || key.length === 0) {
				errors.push({
					field: 'env',
					message: `Server ${name} has invalid environment variable key: ${key}`
				})
			}
			if (typeof value !== 'string') {
				errors.push({
					field: 'env',
					message: `Server ${name} environment variable ${key} must be a string`
				})
			}
		})
	}

	// Setup commands validation
	if (config.setupCommands) {
		if (!config.setupCommands.installPath) {
			errors.push({
				field: 'setupCommands.installPath',
				message: `Server ${name} setupCommands missing required installPath`
			})
		}
		if (!config.setupCommands.command) {
			errors.push({
				field: 'setupCommands.command',
				message: `Server ${name} setupCommands missing required command`
			})
		}
	}

	return {
		isValid: errors.length === 0,
		errors
	}
}

function isValidUrl(url: string): boolean {
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}

export function validateAllConfigs(
	configs: Record<string, ServerConfig>
): ValidationResult {
	const errors: ValidationError[] = []

	Object.entries(configs).forEach(([name, config]) => {
		const result = validateServerConfig(name, config)
		errors.push(...result.errors)
	})

	return {
		isValid: errors.length === 0,
		errors
	}
}
