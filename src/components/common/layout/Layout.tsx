import type { FC, PropsWithChildren } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className='min-h-screen bg-slate-50 text-slate-900'>
			<Header />

		<div className='flex flex-col lg:flex-row lg:items-start'>
			<Sidebar />

			<main className='flex-1 min-w-0 px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6'>
				<div className=''>{children}</div>
			</main>
		</div>
		</div>
	)
}
