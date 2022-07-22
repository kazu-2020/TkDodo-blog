import React, { createContext, Dispatch, useMemo, useReducer } from 'react'

type ArrowStepStore = {
  currentIndex: number
}

type ArrowStepAction = {
  currentIndex: number
}

type ArrowStepState = {
  state: ArrowStepStore
  dispatch: Dispatch<ArrowStepAction>
}

const arrowStepReducer = (state: ArrowStepStore, action: ArrowStepAction) => ({
  ...state,
  currentIndex: action.currentIndex
})

const initialState: ArrowStepStore = {
  currentIndex: 0
}

export const ArrowStepContext = createContext({
  state: initialState,
  dispatch: {}
} as ArrowStepState)

export const ArrowStepContextProvider = (props: any) => {
  const { children } = props

  const [state, dispatch] = useReducer(arrowStepReducer, initialState)
  const providerValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return (
    <ArrowStepContext.Provider value={providerValue}>
      {children}
    </ArrowStepContext.Provider>
  )
}
