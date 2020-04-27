/*
 * Copyright (c) 2019 Geode-solutions
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

import LogoMesh from "@/assets/mesh.svg";
import LogoPointSet from "@/assets/point_set.svg";
import LogoPointSet2D from "@/assets/point_set2d.svg";
import LogoPointSet3D from "@/assets/point_set3d.svg";
import LogoEdgedCurve from "@/assets/edged_curve.svg";
import LogoEdgedCurve2D from "@/assets/edged_curve2d.svg";
import LogoEdgedCurve3D from "@/assets/edged_curve3d.svg";
import LogoSurface from "@/assets/surface.svg";
import LogoTriangulatedSurface from "@/assets/triangulated_surface.svg";
import LogoTriangulatedSurface2D from "@/assets/triangulated_surface2d.svg";
import LogoTriangulatedSurface3D from "@/assets/triangulated_surface3d.svg";
import LogoPolygonalSurface from "@/assets/polygonal_surface.svg";
import LogoPolygonalSurface2D from "@/assets/polygonal_surface2d.svg";
import LogoPolygonalSurface3D from "@/assets/polygonal_surface3d.svg";
import LogoSolid from "@/assets/block.svg";
import LogoTetrahedralSolid from "@/assets/tetrahedral_solid.svg";
import LogoPolyhedralSolid from "@/assets/polyhedral_solid.svg";
import PointsColor from "./components/PointSetColor";
import PointsSize from "./components/PointSetSize";
import SurfaceColor from "./components/SurfaceColor";
import SurfaceMesh from "./components/SurfaceMesh";
import Clip from "./components/Clip";

let pointSetStyle = {
  style: {
    size: 1,
    color: {
      type: "Constant",
      value: [1, 1, 1],
      vertexAttributeName: ""
    }
  }
};

let surfaceStyle = {
  style: {
    mesh: { visible: true },
    color: {
      type: "Constant",
      value: [1, 1, 1],
      vertexAttributeName: "",
      polygonAttributeName: ""
    }
  }
};

const meshStore = {
  namespaced: true,
  actions: {
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
      dispatch("private/loadObject", {
        command: "opengeode.load.edged_curve2d",
        filename
      }).then(object => {
        dispatch("addObject", object, { root: true });
      });
    },
    loadEdgedCurve3D({ dispatch }, filename) {
      dispatch("private/loadObject", {
        command: "opengeode.load.edged_curve3d",
        filename
      }).then(object => {
        dispatch("addObject", object, { root: true });
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
            dispatch("addObject", Object.assign(object, pointSetStyle), {
              root: true
            });
          });
        },
        loadSurface({ dispatch }, { command, filename }) {
          dispatch("loadObject", {
            command,
            filename
          }).then(object => {
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
              command: "opengeode.points.size",
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
          console.log("set color", color)
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
        }
      }
    }
  }
};

export default function(store) {
  store.registerModule("mesh", meshStore);
  store.dispatch("registerObjectType", "PointSet2D");
  store.dispatch("registerObjectType", "PointSet3D");
  store.dispatch("registerObjectType", "EdgedCurve2D");
  store.dispatch("registerObjectType", "EdgedCurve3D");
  store.dispatch("registerObjectType", "PolygonalSurface2D");
  store.dispatch("registerObjectType", "PolygonalSurface3D");
  store.dispatch("registerObjectType", "TriangulatedSurface2D");
  store.dispatch("registerObjectType", "TriangulatedSurface3D");
  store.dispatch("registerObjectType", "PolyhedralSolid3D");
  store.dispatch("registerObjectType", "TetrahedralSolid3D");
  store.commit("ui/registerInputItem", {
    parent: "import",
    name: "mesh",
    component: LogoMesh,
    tooltip: "Import mesh"
  });
  store.commit("ui/registerInputItem", {
    parent: "mesh",
    name: "point set",
    component: LogoPointSet,
    tooltip: "Import point set"
  });
  store.commit("ui/registerInputItem", {
    parent: "point set",
    name: "2D",
    component: LogoPointSet2D,
    tooltip: "Import point set 2D",
    action: "mesh/loadPointSet2D"
  });
  store.commit("ui/registerInputItem", {
    parent: "point set",
    name: "3D",
    component: LogoPointSet3D,
    tooltip: "Import point set 3D",
    action: "mesh/loadPointSet3D"
  });
  store.commit("ui/registerInputItem", {
    parent: "mesh",
    name: "curve",
    component: LogoEdgedCurve,
    tooltip: "Import curve"
  });
  store.commit("ui/registerInputItem", {
    parent: "curve",
    name: "2D",
    component: LogoEdgedCurve2D,
    tooltip: "Import curve 2D",
    action: "mesh/loadEdgedCurve2D"
  });
  store.commit("ui/registerInputItem", {
    parent: "curve",
    name: "3D",
    component: LogoEdgedCurve3D,
    tooltip: "Import curve 3D",
    action: "mesh/loadEdgedCurve3D"
  });
  store.commit("ui/registerInputItem", {
    parent: "mesh",
    name: "surface",
    component: LogoSurface,
    tooltip: "Import surface"
  });
  store.commit("ui/registerInputItem", {
    parent: "surface",
    name: "triangulated surface",
    component: LogoTriangulatedSurface,
    tooltip: "Import triangulated surface"
  });
  store.commit("ui/registerInputItem", {
    parent: "triangulated surface",
    name: "2D",
    component: LogoTriangulatedSurface2D,
    tooltip: "Import triangulated surface 2D",
    action: "mesh/loadTriangulatedSurface2D"
  });
  store.commit("ui/registerInputItem", {
    parent: "triangulated surface",
    name: "3D",
    component: LogoTriangulatedSurface3D,
    tooltip: "Import triangulated surface 3D",
    action: "mesh/loadTriangulatedSurface3D"
  });
  store.commit("ui/registerInputItem", {
    parent: "surface",
    name: "polygonal surface",
    component: LogoPolygonalSurface,
    tooltip: "Import polygonal surface"
  });
  store.commit("ui/registerInputItem", {
    parent: "polygonal surface",
    name: "2D",
    component: LogoPolygonalSurface2D,
    tooltip: "Import polygonal surface 2D",
    action: "mesh/loadPolygonalSurface2D"
  });
  store.commit("ui/registerInputItem", {
    parent: "polygonal surface",
    name: "3D",
    component: LogoPolygonalSurface3D,
    tooltip: "Import polygonal surface 3D",
    action: "mesh/loadPolygonalSurface3D"
  });
  store.commit("ui/registerInputItem", {
    parent: "mesh",
    name: "solid",
    component: LogoSolid,
    tooltip: "Import solid"
  });
  store.commit("ui/registerInputItem", {
    parent: "solid",
    name: "tetrahedral solid",
    component: LogoTetrahedralSolid,
    tooltip: "Import tetrahedral solid",
    action: "mesh/loadTetrahedralSolid"
  });
  store.commit("ui/registerInputItem", {
    parent: "solid",
    name: "polyhedral solid",
    component: LogoPolyhedralSolid,
    tooltip: "Import polyhedral solid",
    action: "mesh/loadPolyhedralSolid"
  });
  store.commit("ui/registerContextualItem", {
    type: "PointSet2D",
    component: PointsSize
  });
  store.commit("ui/registerContextualItem", {
    type: "PointSet3D",
    component: PointsSize
  });
  store.commit("ui/registerContextualItem", {
    type: "PointSet2D",
    component: PointsColor
  });
  store.commit("ui/registerContextualItem", {
    type: "PointSet3D",
    component: PointsColor
  });
  store.commit("ui/registerContextualItem", {
    type: "TriangulatedSurface2D",
    component: SurfaceMesh
  });
  store.commit("ui/registerContextualItem", {
    type: "TriangulatedSurface3D",
    component: SurfaceMesh
  });
  store.commit("ui/registerContextualItem", {
    type: "PolygonalSurface2D",
    component: SurfaceMesh
  });
  store.commit("ui/registerContextualItem", {
    type: "PolygonalSurface3D",
    component: SurfaceMesh
  });
  store.commit("ui/registerContextualItem", {
    type: "TriangulatedSurface2D",
    component: SurfaceColor
  });
  store.commit("ui/registerContextualItem", {
    type: "TriangulatedSurface3D",
    component: SurfaceColor
  });
  store.commit("ui/registerContextualItem", {
    type: "PolygonalSurface2D",
    component: SurfaceColor
  });
  store.commit("ui/registerContextualItem", {
    type: "PolygonalSurface3D",
    component: SurfaceColor
  });
  store.commit("ui/registerContextualItem", {
    type: "TetrahedralSolid",
    component: Clip
  });
}
