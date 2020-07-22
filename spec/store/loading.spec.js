import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import * as loading from '~/store/loading.ts'

const localVue = createLocalVue()
localVue.use(Vuex)

let action
const testedAction = (context = {}, payload = {}) => {
  return loading.actions[action](context, payload)
}

describe('store/loading.ts', () => {
  let store
  beforeEach(() => {
    store = new Vuex.Store(loading)
  })
  describe('getters', () => {
    it('stateを取得', () => {
      store.replaceState({
        state: 'loading',
      })
      expect(store.getters.state).toBe('loading')
    })
  })
  describe('actions', () => {
    let commit
    let state
    beforeEach(() => {
      commit = store.commit
      state = store.state
    })
    describe('startLoading', () => {
      it('state が変わりメッセージがセットされる', async (done) => {
        action = 'startLoading'
        await testedAction({ commit, state }, 'hello')
        expect(store.getters.state).toBe('loading')
        expect(store.getters.messages).toBe('hello')

        done()
      })
    })

    describe('succeedLoading', () => {
      describe('state が loading の場合', () => {
        it('state が success になること', async (done) => {
          store.replaceState({
            state: 'loading',
          })

          action = 'succeedLoading'
          await testedAction({ commit, state })
          expect(store.getters.state).toBe('success')

          done()
        })
      })

      describe('state が none の場合', () => {
        it('state が変わらず none のままになる', async (done) => {
          store.replaceState({
            state: 'none',
          })

          action = 'succeedLoading'
          await testedAction({ commit, state })
          expect(store.getters.state).toBe('none')

          done()
        })
      })
    })

    describe('failLoading', () => {
      describe('state が loading の場合', () => {
        it('state が error になること', async (done) => {
          store.replaceState({
            state: 'loading',
          })

          action = 'failLoading'
          await testedAction({ commit, state })
          expect(store.getters.state).toBe('error')

          done()
        })
      })

      describe('state が none の場合', () => {
        it('state が変わらず none のままになる', async (done) => {
          store.replaceState({
            state: 'none',
          })

          action = 'failLoading'
          await testedAction({ commit, state })
          expect(store.getters.state).toBe('none')

          done()
        })
      })
    })

    describe('resetLoadingState', () => {
      it('state が none になること', async (done) => {
        store.replaceState({
          state: 'loading',
        })

        action = 'resetLoadingState'
        await testedAction({ commit, state })
        expect(store.getters.state).toBe('none')

        done()
      })
    })
  })
})
