export const TsconfigTemplate = `{
  "exclude": ["**/*.spec.ts"],
	"compilerOptions": {
    "lib": ["es2015", "dom"],
    "outDir": "",
		"sourceMap": false,
		"module": "CommonJS",
		"target": "esnext",
		"strict": true,
		"noImplicitAny": false,
		"forceConsistentCasingInFileNames": true
	}
}
`;
