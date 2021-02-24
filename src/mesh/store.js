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
  actions: {
    createPoint({ dispatch }, point) {
      dispatch(
        "network/call",
        {
          command: "opengeode.create.point",
          args: [point.name, point.x, point.y, point.z]
        },
        { root: true }
      ).then(object => {
        let pointSetStyle = {
          style: {
            size: 1,
            color: {
              type: "Constant",
              value: [1, 1, 1],
              vertexAttributeName: "",
              polygonAttributeName: ""
            }
          }
        };
        dispatch("addObject", Object.assign(object, pointSetStyle), {
          root: true
        });
      });
    },
    loadPointSet2D({ dispatch }, filename) {
      dispatch("private/loadPointSet", {
        command: "opengeode.load.point_set2d",
        filename
      });
    },
    loadPointSet3D({ dispatch }, filename) {
      dispatch("private/loadPointSet", {
        command: "opengeode.load.point_set3d",
        filename
      });
    },
    loadEdgedCurve2D({ dispatch }, filename) {
      dispatch("private/loadEdgedCurve", {
        command: "opengeode.load.edged_curve2d",
        filename
      });
    },
    loadEdgedCurve3D({ dispatch }, filename) {
      dispatch("private/loadEdgedCurve", {
        command: "opengeode.load.edged_curve3d",
        filename
      });
    },
    loadPolygonalSurface2D({ dispatch }, filename) {
      dispatch("private/loadSurface", {
        command: "opengeode.load.surface.polygonal2d",
        filename
      });
    },
    loadPolygonalSurface3D({ dispatch }, filename) {
      dispatch("private/loadSurface", {
        command: "opengeode.load.surface.polygonal3d",
        filename
      });
    },
    loadTriangulatedSurface2D({ dispatch }, filename) {
      dispatch("private/loadSurface", {
        command: "opengeode.load.surface.triangulated2d",
        filename
      });
    },
    loadTriangulatedSurface3D({ dispatch }, filename) {
      dispatch("private/loadSurface", {
        command: "opengeode.load.surface.triangulated3d",
        filename
      });
    },
    loadPolyhedralSolid({ dispatch }, filename) {
      dispatch("private/loadObject", {
        command: "opengeode.load.solid.polyhedral3d",
        filename
      }).then(object => {
        dispatch("addObject", object, { root: true });
      });
    },
    loadTetrahedralSolid({ dispatch }, filename) {
      dispatch("private/loadObject", {
        command: "opengeode.load.solid.tetrahedral3d",
        filename
      }).then(object => {
        dispatch("addObject", object, { root: true });
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
        loadPointSet({ dispatch }, { command, filename }) {
          dispatch("loadObject", {
            command,
            filename
          }).then(object => {
            let pointSetStyle = {
              style: {
                size: 1,
                color: {
                  type: "Constant",
                  value: [1, 1, 1],
                  vertexAttributeName: "",
                  polygonAttributeName: ""
                }
              }
            };
            dispatch("addObject", Object.assign(object, pointSetStyle), {
              root: true
            });
          });
        },
        loadEdgedCurve({ dispatch }, { command, filename }) {
          dispatch("loadObject", {
            command,
            filename
          }).then(object => {
            let edgedCurveStyle = {
              style: {
                size: 1,
                color: {
                  type: "Constant",
                  value: [1, 1, 1],
                  vertexAttributeName: "",
                  polygonAttributeName: ""
                },
                points: {
                  size: 1,
                  color: {
                    type: "Constant",
                    value: [1, 1, 1],
                    vertexAttributeName: "",
                    polygonAttributeName: ""
                  }
                }
              }
            };

            dispatch("addObject", Object.assign(object, edgedCurveStyle), {
              root: true
            });
          });
        },
        loadSurface({ dispatch }, { command, filename }) {
          dispatch("loadObject", {
            command,
            filename
          }).then(object => {
            let surfaceStyle = {
              style: {
                mesh: { visible: false },
                color: {
                  type: "Constant",
                  value: [1, 1, 1],
                  vertexAttributeName: "",
                  polygonAttributeName: ""
                }
              }
            };
            dispatch("addObject", Object.assign(object, surfaceStyle), {
              root: true
            });
          });
        }
      }
    },
    style: {
      namespaced: true,
      actions: {
        setPointsSize({ commit, dispatch }, { id, value }) {
          commit(
            "setObjectStyle",
            {
              id,
              style: ["size"],
              value
            },
            { root: true }
          );
          dispatch(
            "network/call",
            {
              command: "opengeode.point.size",
              args: [id, value]
            },
            { root: true }
          );
        },
        setEdgeVisibility({ commit, dispatch }, { id, value }) {
          commit(
            "setObjectStyle",
            {
              id,
              style: ["mesh", "visible"],
              value
            },
            { root: true }
          );
          dispatch(
            "network/call",
            {
              command: "opengeode.edge.visibility",
              args: [id, value]
            },
            { root: true }
          );
        },
        setColor({ commit, dispatch }, { id, color }) {
          console.log("set color", color);
          commit(
            "setObjectStyle",
            {
              id,
              style: ["color", "value"],
              value: color
            },
            { root: true }
          );
          dispatch(
            "network/call",
            {
              command: "opengeode.color",
              args: [id, color]
            },
            { root: true }
          );
        },
        setAttributeColor({ commit, dispatch }, { id, attribute, location }) {
          commit(
            "setObjectStyle",
            {
              id,
              style: ["color", location + "AttributeName"],
              value: attribute
            },
            { root: true }
          );
          dispatch(
            "network/call",
            {
              command: "opengeode.attribute." + location,
              args: [id, attribute]
            },
            { root: true }
          );
        }
      }
    }
  }
};
