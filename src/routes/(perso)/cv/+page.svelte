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
- Realize 2 pivots of the company while migration was ongoing
- Hire and manage a tech team of senior developers
				`
		},
		{
			company: 'Theodo',
			role: 'Engineering Manager @bpifrance',
			duration: 'Mar 2020 - Jun 2022',
			description: `Build a platform to automate lawns for small companies during Covid

*Main challenges*

- Concept and plan in the Rebond platform in 1 week during the Covid crisis cell with the CTO of Online Banking and the CDO of BPI
- Led the team of 8 senior developers to build the platform in 3 weeks and deliver 7000 loans in the next 6 months
- Scale the solution to a modular credit distribution tunnel to support Bpifrance's platform offer
			`
		},
		{
			company: 'Theodo',
			role: 'Engineering Manager @Tarkett',
			duration: 'Oct 2018 - Dec 2019',
			description: `Responsible for four teams (12 tech members in total) on the Tarkett product catalog, deployed in 27 countries.

*Main challenges*

- Leading product governance with the client
- Manage roadmap, delivery and coaching of four teams
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
			role: 'Web and Mobile Developer',
			duration: 'Apr 2016 - Feb 2018',
			description:
				'Fullstack developer on Flask, Angular, React Native, Ionic and React applications'
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
			degree: 'Secured Information Systems (SIS)',
			duration: '2012 - 2016'
		},
		{
			place: 'Lycée Massena',
			degree: 'Classe préparatoire PC*',
			duration: '2010 - 2012'
		}
	];
</script>

<div class="min-h-screen flex flex-col items-center py-10">
	<div class="bg-white rounded-lg shadow-lg w-full max-w-4xl">
		<div class="flex flex-col md:flex-row">
			<!-- Personal Info Column -->
			<div class="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 p-6">
				<div class="w-full flex justify-start">
					<img
						class="w-36 h-36 rounded-full overflow-hidden mb-3"
						src="https://media.licdn.com/dms/image/D4E03AQFge-Zs6yHd9Q/profile-displayphoto-shrink_800_800/0/1683011178267?e=1726704000&v=beta&t=akGilq_8akjnD4FlgxqjKctbn6spQ4VwFBr5hcbpS1M"
					/>
				</div>
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
				<div class="mb-5">
					<h3 class="text-xl font-semibold mb-2">Languages</h3>
					<ul class="list-disc list-inside">
						{#each personalInfo.languages as language}
							<li>{language}</li>
						{/each}
					</ul>
				</div>
				<div>
					<h3 class="text-xl font-semibold mb-2">Formations</h3>
					<ul class="ml-3 flex flex-col gap-3">
						{#each formations as formation}
							<li class="flex gap-1 flex-col">
								{formation.place} ({formation.duration})
								<span class="text-gray-500 text-sm">{formation.degree}</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<!-- Experience Column -->
			<div class="w-full md:w-2/3 p-4">
				<h2 class="text-2xl font-bold mb-4">Experiences</h2>
				<div class="timeline">
					{#each experiences as experience}
						<div class="mb-6">
							<div class="p-4">
								<h3 class="text-xl font-semibold">{experience.role}</h3>
								<div class="text-gray-500">{experience.company} - {experience.duration}</div>
								<div class="mt-2 cms-content text-sm">
									{@html marked(experience.description || '')}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
