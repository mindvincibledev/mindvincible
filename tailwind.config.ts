
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				orange: 'hsl(var(--orange))',
				lavender: 'hsl(var(--lavender))',
				cyan: 'hsl(var(--cyan))',
				yellow: 'hsl(var(--yellow))',
				pink: 'hsl(var(--pink))',
				green: 'hsl(var(--green))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'slide-in': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'wave': {
					'0%': { transform: 'translateX(0) scaleY(1)' },
					'50%': { transform: 'translateX(-25%) scaleY(0.5)' },
					'100%': { transform: 'translateX(-50%) scaleY(1)' }
				},
				'wave1': {
					'0%': { transform: 'translate3d(-90px, 0, 0)' },
					'100%': { transform: 'translate3d(85px, 0, 0)' },
				  },
				  'wave2': {
					'0%': { transform: 'translate3d(-90px, 0, 0)' },
					'100%': { transform: 'translate3d(85px, 0, 0)' },
				  },
				  'wave3': {
					'0%': { transform: 'translate3d(-90px, 0, 0)' },
					'100%': { transform: 'translate3d(85px, 0, 0)' },
				  },
				  'wave4': {
					'0%': { transform: 'translate3d(-90px, 0, 0)' },
					'100%': { transform: 'translate3d(85px, 0, 0)' },
				  },
				  'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				  },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'wave': 'wave 15s linear infinite',
				'wave1': 'wave1 7s infinite',
        'wave2': 'wave2 5s infinite',
        'wave3': 'wave3 3s infinite',
        'wave4': 'wave4 2s infinite',
        'float': 'float 6s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
