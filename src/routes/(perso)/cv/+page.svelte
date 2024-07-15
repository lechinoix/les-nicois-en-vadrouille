<script lang="ts">
	import marked from 'marked';
	let experiences = [
		{
			company: 'Barooders',
			role: 'Head of Engineering',
			duration: 'Dec 2022 - Present',
			description: `Responsible of tech quality, team delivery, recruitment and management of the tech team

*Main challenges*

- Migrate from a costly no code architecture to a scalable application
- Anticipate and implement necessary pivots of the company
- Hire and manage a small tech team of senior developers to stay very agile
- Closely work with sales, operations and management teams
				`
		},
		{
			company: 'Theodo',
			role: 'Engineering Manager @bpifrance',
			duration: 'Mar 2020 - Jun 2022',
			description: `Scale of the platform offer to help automate small lawns to small companies, particularly hit by the Covid crisis

*Main challenges*

- Concept and plan in the Rebond platform in 1 week during the Covid crisis cell with the CTO of Online Banking and the CDO of BPI
- Led the team of 8 senior developers to build the platform in 3 weeks and deliver 7000 loans in the next 6 months
- Scale the solution to a modular credit distribution tunnel to support Bpifrance's platform offer
- Integrate it into the microservice environment of Bpifrance Online Banking
- Coordinate nine technical teams to work on this tool
			`
		},
		{
			company: 'Theodo',
			role: 'Engineering Manager @Tarkett',
			duration: 'Oct 2018 - Dec 2019',
			description: `Responsible for four teams (12 tech members in total) on the Tarkett product catalog, deployed in 27 countries.

*Main challenges*

- Leading product governance with the client
- Manage roadmap and delivery of four teams
- Manage progression of four tech leads
- Concept and implement a migration from Twig + Vue to Nuxt`
		},
		{
			company: 'Theodo',
			role: 'Lead Software Engineer @BNP',
			duration: 'Feb 2018 - Oct 2018',
			description: `Responsible for a team of 4 developers for the design and construction of a React / Redux / Flask application in direct collaboration with the client.

*Main challenges*

- Stay performant on low capacity computers
- Build a components library shared with other teams`
		},
		{
			company: 'Theodo',
			role: 'Web Developer',
			duration: 'Jul 2017 - Feb 2018',
			description:
				'Fullstack developer on Flask, Angular, Ionic and React applications (BNPParibas)'
		},
		{
			company: 'Bam.tech',
			role: 'Mobile Apps Developer',
			duration: 'Feb 2017 - Jul 2017',
			description: `Developed 2 React Native applications with offline Redux store (UGC Direct) and white label frontend deployment (Storyssimo).`
		}
	];

	let personalInfo = {
		name: 'Nicolas Ngô-Maï',
		email: 'nicolas.ngomai@gmail.com',
		address: '1 rue Paul Dijon, 38000 Grenoble',
		phone: '+33 6 72 14 74 35',
		objective:
			'Join a dynamic team where I can value my skills in software engineering and team management',
		skills: [
			'NestJS',
			'Symfony',
			'Flask',
			'SpringBoot',
			'Serverless',
			'Postgres',
			'AWS',
			'and numerous various SAAS tools...'
		],
		languages: ['🇫🇷 French - native', '🇬🇧 English - fluent', '🇪🇸 Spanish - scolar']
	};

	let formations = [
		{
			place: 'Supélec',
			degree: 'Master of Information Security',
			duration: '2012 - 2016',
			description: 'M2 of Secured Information Systems (SIS) in Paris and Rennes'
		}
	];
</script>

<div class="min-h-screen bg-gray-100 flex flex-col items-center py-10">
	<div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
		<div class="flex flex-col md:flex-row">
			<!-- Personal Info Column -->
			<div class="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 p-4">
				<div class="mb-4">
					<h2 class="text-2xl font-bold mb-1">{personalInfo.name}</h2>
					<p class="text-gray-600">{personalInfo.email}</p>
					<p class="text-gray-600">{personalInfo.phone}</p>
					<p class="text-gray-600">{personalInfo.address}</p>
				</div>
				<div class="mb-4">
					<h3 class="text-xl font-semibold mb-2">Objective</h3>
					<p>{personalInfo.objective}</p>
				</div>
				<div class="mb-4">
					<h3 class="text-xl font-semibold mb-2">Skills</h3>
					<ul class="list-disc list-inside">
						{#each personalInfo.skills as skill}
							<li>{skill}</li>
						{/each}
					</ul>
				</div>
				<div>
					<h3 class="text-xl font-semibold mb-2">Languages</h3>
					<ul class="list-disc list-inside">
						{#each personalInfo.languages as language}
							<li>{language}</li>
						{/each}
					</ul>
				</div>
			</div>

			<!-- Experience Column -->
			<div class="w-full md:w-2/3 p-4">
				<h2 class="text-2xl font-bold mb-4">Experience</h2>
				<div class="timeline">
					{#each experiences as experience}
						<div class="mb-6">
							<div class="bg-gray-100 p-4 rounded-lg shadow-md">
								<h3 class="text-xl font-semibold">{experience.role}</h3>
								<div class="text-gray-500">{experience.company} - {experience.duration}</div>
								<div class="mt-2 cms-content text-sm">
									{@html marked(experience.description || '')}
								</div>
							</div>
						</div>
					{/each}
				</div>
				<h2 class="text-2xl font-bold mb-4">Formation</h2>
				<div class="timeline">
					{#each formations as formation}
						<div class="mb-6">
							<div class="bg-gray-100 p-4 rounded-lg shadow-md">
								<h3 class="text-xl font-semibold">{formation.degree}</h3>
								<div class="text-gray-500">{formation.place} - {formation.duration}</div>
								<div class="mt-2 cms-content text-sm">
									{@html marked(formation.description || '')}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.timeline {
		border-left: 2px solid #e5e7eb; /* Tailwind Gray-200 */
		padding-left: 1rem;
		position: relative;
	}
	.timeline::before {
		content: '';
		position: absolute;
		left: -6px;
		top: 0;
		bottom: 0;
		width: 10px;
		background: white;
		border-radius: 50%;
	}
</style>
