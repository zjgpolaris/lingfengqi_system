import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import apis from '@/apis/apis'

Vue.use(Vuex)
const loadAction = (commit,payload,mutationName)=>{
  axios.get(payload.api,{pageNo:payload.pageNo,pageSize:payload.pageSize})
  .then((resp)=>{
     resp = resp.data;
     commit(mutationName,resp)
  })
}

export default new Vuex.Store({
  state: {
    MusicType : [],
    MusicList : []
  },
  getters:{
    MusicType(state){
      return state.MusicType.data
    },
    MusicList(state){
      return state.MusicList.data
    }
  },
  mutations: {
    LOADMUSICTYPE(state,payload){
      state.MusicType = payload
    },
    LOADMUSICLIST(state,payload){
      state.MusicList = payload
    },
  },
  actions: {
    loadMusicType({commit},payload={}){
      payload.api = apis.findMusicTypes;
      loadAction(commit,payload,'LOADMUSICTYPE')
    },
    loadMusicList({commit},payload={}){
      payload.api = apis.findMusic
      loadAction(commit,payload,'LOADMUSICLIST')
    }
  }
})
