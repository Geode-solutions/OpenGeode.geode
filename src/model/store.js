/*
 * Copyright (c) 2019 - 2021 Geode-solutions
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

export default {
  namespaced: true,
  state: {},
  actions: {
    loadSection({ state, dispatch }, filename) {
      dispatch("private/loadObject", {
        command: "opengeode.load.section",
        filename
      }).then(object => {
        let sectionStyle = {
          style: {
            corners: { visible: true, size: 1, color: [1, 1, 1] },
            lines: { visible: true, color: [1, 1, 1] },
            surfaces: {
              visible: true,
              color: [1, 1, 1],
              mesh: { visible: false }
            },
            blocks: {}
          }
        };
        dispatch("addObject", Object.assign(object, sectionStyle), { root: true });
      });
    },
    loadBRep({ state, dispatch }, filename) {
      dispatch("private/loadObject", {
        command: "opengeode.load.brep",
        filename
      }).then(object => {
        let brepStyle = {
          style: {
            corners: { visible: true, size: 1, color: [1, 1, 1] },
            lines: { visible: true, color: [1, 1, 1] },
            surfaces: {
              visible: true,
              color: [1, 1, 1],
              mesh: { visible: false }
            },
            blocks: {}
          }
        };
        dispatch("addObject", Object.assign(object, brepStyle), { root: true });
      });
    }
  },
  modules: {
    private: {
      namespaced: true,
      actions: {
        loadObject({ dispatch }, { command, filename }) {
          return dispatch(
            "network/call",
            {
              command,
              args: [filename]
            },
            { root: true }
          );
        },
        setModelComponentsVisibility(
          { commit, dispatch },
          { id, objectType, value }
        ) {
          commit(
            "setObjectStyle",
            {
              id,
              style: [objectType, "visible"],
              value
            },
            { root: true }
          );
          dispatch(
            "network/call",
            {
              command: "opengeode.model.components.visibility",
              args: [id, objectType, value]
            },
            { root: true }
          );
        },
        setModelComponentsColor(
          { commit, dispatch },
          { id, objectType, value }
        ) {
          commit(
            "setObjectStyle",
            {
              id,
              style: [objectType, "color"],
              value
            },
            { root: true }
          );
          dispatch(
            "network/call",
            {
              command: "opengeode.model.components.color",
              args: [id, objectType, value]
            },
            { root: true }
          );
        }
      }
    },
    style: {
      namespaced: true,
      actions: {
        setSurfacesMeshVisibility({ commit, dispatch }, { id, value }) {
          commit(
            "setObjectStyle",
            {
              id,
              style: ["surfaces", "mesh", "visible"],
              value
            },
            { root: true }
          );
          dispatch(
            "network/call",
            {
              command: "opengeode.model.mesh.visibility",
              args: [id, "surfaces", value]
            },
            { root: true }
          );
        },
        setCornersVisibility({ commit, dispatch }, { id, value }) {
          dispatch(
            "model/private/setModelComponentsVisibility",
            { id, objectType: "corners", value },
            { root: true }
          );
          commit(
            "ui/setContextualItemVisibility",
            {
              name: "CornersSize",
              value
            },
            { root: true }
          );
          commit(
            "ui/setContextualItemVisibility",
            {
              name: "CornersColor",
              value
            },
            { root: true }
          );
        },
        setCornersColor({ dispatch }, { id, value }) {
          dispatch(
            "model/private/setModelComponentsColor",
            { id, objectType: "corners", value },
            { root: true }
          );
        },
        setCornersSize({ commit, dispatch }, { id, value }) {
          commit(
            "setObjectStyle",
            {
              id,
              style: ["corners", "size"],
              value
            },
            { root: true }
          );
          dispatch(
            "network/call",
            {
              command: "opengeode.model.corners.size",
              args: [id, value]
            },
            { root: true }
          );
        },
        setLinesVisibility({ commit, dispatch }, { id, value }) {
          dispatch(
            "model/private/setModelComponentsVisibility",
            { id, objectType: "lines", value },
            { root: true }
          );
          commit(
            "ui/setContextualItemVisibility",
            {
              name: "LinesColor",
              value
            },
            { root: true }
          );
        },
        setLinesColor({ dispatch }, { id, value }) {
          dispatch(
            "model/private/setModelComponentsColor",
            { id, objectType: "lines", value },
            { root: true }
          );
        },
        setSurfacesVisibility({ commit, dispatch }, { id, value }) {
          dispatch(
            "model/private/setModelComponentsVisibility",
            { id, objectType: "surfaces", value },
            { root: true }
          );
          commit(
            "ui/setContextualItemVisibility",
            {
              name: "SurfacesMesh",
              value
            },
            { root: true }
          );
          commit(
            "ui/setContextualItemVisibility",
            {
              name: "SurfacesColor",
              value
            },
            { root: true }
          );
        },
        setSurfacesColor({ dispatch }, { id, value }) {
          dispatch(
            "model/private/setModelComponentsColor",
            { id, objectType: "surfaces", value },
            { root: true }
          );
        }
      }
    }
  }
};
