import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
  		backgroundImage: {
  			gradient: 'linear-gradient(180deg, rgba(55, 87, 81, 0.08) 44.13%, rgba(55, 87, 81, 0.39) 100%);',
  			'gradient-2': 'linear-gradient(215deg, rgba(76, 155, 141, 0.15) -61.92%, rgba(76, 155, 141, 0.00) 123.07%);',
  			'gradient-2-hover': 'linear-gradient(0deg, rgba(173, 178, 178, 0.06) 0%, rgba(173, 178, 178, 0.06) 100%), linear-gradient(215deg, rgba(76, 155, 141, 0.15) -61.92%, rgba(76, 155, 141, 0.00) 123.07%);'
  		},
  		colors: {
  			'b1-black': '#1D1E20',
  			'b1-stroke': '#3C4041',
  			'b1-section': '#546170',
  			'b1-bg': 'rgba(173, 178, 178, 0.06)',
  			'gray-1': '#DDDEDE',
  			'gray-2': '#ADB2B2',
  			'gray-3': '#373E41',
  			'message-box': '#212627',
  			'black-section': '#141414',
  			'black-moderate': '#1D1E20',
  			'gray-moderate': '#3C4041',
  			'black-weak': '#1D1E2040',
  			'hover-1': '#ADB2B20F',
  			'hover-2': '#7FB2A9',
  			'hover-pink': '#BB5E7A',
  			'hover-green': '#4C9B8D',
  			'text-weak': '#ADB2B2',
  			'text-moderate': '#DDDEDE',
  			'text-strong': '#FFFFFF',
  			'text-disabled': '#3C4041',
  			'green-1': '#375751',
  			'green-2': '#4C9B8D',
  			'disabled-pink': '#7B4657',
  			'disabled-green': '#375751',
  			'strong-green': '#39D0B5',
  			'strong-error': '#FB759D',
  			'strong-yellow': '#FFD063',
  			'strong-blue': '#99BCFF'
  		},
  		fontSize: {
  			'display-18': [
  				'18px',
  				{
  					lineHeight: '22px',
  					letterSpacing: '0.2px'
  				}
  			],
  			'display-16': [
  				'16px',
  				{
  					lineHeight: '20px',
  					letterSpacing: '0.5px'
  				}
  			],
  			'display-15': [
  				'15px',
  				{
  					lineHeight: '22px',
  					letterSpacing: '0.5px'
  				}
  			],
  			'display-14': [
  				'14px',
  				{
  					lineHeight: '22px',
  					letterSpacing: '0.5px'
  				}
  			],
  			'display-12': [
  				'12px',
  				{
  					lineHeight: '15px',
  					letterSpacing: '0.2px'
  				}
  			],
  			'text-s-16': [
  				'16px',
  				{
  					lineHeight: '24px',
  					letterSpacing: '0.2px'
  				}
  			],
  			'text-s-13': [
  				'13px',
  				{
  					lineHeight: '20px',
  					letterSpacing: '0px'
  				}
  			],
  			'text-s-12': [
  				'12px',
  				{
  					lineHeight: '18px',
  					letterSpacing: '0px'
  				}
  			]
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
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  		},
			transitionDuration: {
        DEFAULT: "350ms",
      },
  	}
  },
  plugins: [
    require("tailwindcss-animate"), 
    require('@tailwindcss/line-clamp'),
  ],
} satisfies Config

export default config