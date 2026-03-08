import { useState, useCallback, useRef, useEffect } from 'react'

type SetStateAction<T> = T | ((prev: T) => T)
type Callback<T> = (state: T) => void

export function useStateWithCallback<T>(
	initialState: T
): [T, (newState: SetStateAction<T>, cb?: Callback<T>) => void] {
	const [state, setState] = useState<T>(initialState)
	const cbRef = useRef<Callback<T> | null>(null)

	const updateState = useCallback(
		(newState: SetStateAction<T>, cb?: Callback<T>) => {
			cbRef.current = cb || null

			setState(prev =>
				typeof newState === 'function'
					? (newState as (prev: T) => T)(prev)
					: newState
			)
		},
		[]
	)

	useEffect(() => {
		if (cbRef.current) {
			cbRef.current(state)
			cbRef.current = null
		}
	}, [state])

	return [state, updateState]
}
