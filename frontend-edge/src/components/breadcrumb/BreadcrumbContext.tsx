import React, {createContext, Dispatch, useMemo, useReducer} from 'react'

type BreadcrumbStore = {
  name: string;
}

type BreadcrumbAction = {
  name: string;
}

type BreadcrumbState = {
  state: BreadcrumbStore,
  dispatch: Dispatch<BreadcrumbAction>
}

const breadcrumbReducer = (state: BreadcrumbStore, action: BreadcrumbAction) => ({
    ...state,
    name: action.name
  })

const initialState: BreadcrumbStore = {
  name: '',
}

export const BreadcrumbContext = createContext({state: initialState, dispatch: {}} as BreadcrumbState)
export const BreadcrumbContextProvider = (props: any) => {
  const {children} = props

  const [state, dispatch] = useReducer(breadcrumbReducer, initialState)
  const providerValue = useMemo(() => ({state, dispatch}), [state, dispatch])

  return (
    <BreadcrumbContext.Provider value={providerValue}>
      {children}
    </BreadcrumbContext.Provider>
  )
}