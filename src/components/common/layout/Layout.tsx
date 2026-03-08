import type { FC, PropsWithChildren } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className='min-h-screen bg-slate-50 text-slate-900'>
			<Header />

			<div className='flex'>
				<Sidebar />

				<main className='flex-1 p-6 ml-64'>
					<div className=''>{children}</div>
				</main>
			</div>
		</div>
	)
}
