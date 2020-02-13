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

import vtkDataArray from "vtk.js/Sources/Common/Core/DataArray";
import vtkPolyData from "vtk.js/Sources/Common/DataModel/PolyData";
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
import SurfaceColor from "./components/SurfaceColor";
import SurfaceMesh from "./components/SurfaceMesh";
import Clip from "./components/Clip";

function getVerts(pointset) {
  const nb = pointset.nb_vertices();
  const verts = new Uint32Array(2 * nb);
  let count = 0;
  for (let p = 0; p < nb; p++) {
    verts[count++] = 1;
    verts[count++] = p;
  }
  return verts;
}

function createVtkPoints(pointSet, dimension, callback) {
  let dataset = vtkPolyData.newInstance();
  const points = callback(pointSet);
  dataset.getPoints().setData(points, 3);
  const verts = getVerts(pointSet);
  dataset.getVerts().setData(verts);
  return dataset;
}

let surfaceStyle = { mesh: { visible: true }, color: [1, 1, 1] };

const meshStore = {
  namespaced: true,
  state: {},
  actions: {
    getVtkPoints({ state }, { pointSet, dimension }) {
      return createVtkPoints(
        pointSet,
        dimension,
        state.lib["get_vtk_points" + dimension + "D"]
      );
    },
    getVtkLines({ state }, { curve, dimension }) {
      let dataset = createVtkPoints(
        curve,
        dimension,
        state.lib["get_vtk_line_points" + dimension + "D"]
      );
      const edges = state.lib["get_vtk_edges" + dimension + "D"](curve);
      dataset.getLines().setData(edges);
      return dataset;
    },
    getVtkSurface({ state }, { surface, dimension }) {
      let dataset = createVtkPoints(
        surface,
        dimension,
        state.lib["get_vtk_surface_points" + dimension + "D"]
      );
      const polygons = state.lib["get_vtk_polygons" + dimension + "D"](surface);
      dataset.getPolys().setData(polygons);
      //if (dimension === 3) {
      //  const normal_data = state.lib.get_vtk_normals(surface);
      //  const normals = vtkDataArray.newInstance({
      //    numberOfComponents: 3,
      //    values: normal_data,
      //    name: "Normals"
      //  });
      //  dataset.getPointData().setNormals(normals);
      //}
      return dataset;
    },
    getVtkSolid({ state }, solid) {
      let dataset = createVtkPoints(solid, 3, state.lib.get_vtk_solid_points);
      const facets = state.lib.get_vtk_facets(solid);
      dataset.getPolys().setData(facets);
      return dataset;
    },
    storeObject(
      { dispatch, rootState },
      { type, cpp, dataset, filename, representation, style }
    ) {
      dispatch(
        "addObject",
        {
          type,
          name: filename.replace(/^.*[\\\/]/, "").replace(/\.[^/.]+$/, ""),
          cpp,
          vtk: dataset,
          style
        },
        { root: true }
      ).then(source =>
        rootState.proxyManager
          .getRepresentations()
          .filter(r => r.getInput() === source)
          .forEach(r => r.setRepresentation(representation))
      );
    },
    loadPointSet2D({ state, dispatch }, filename) {
      let pointSet = new state.lib.PointSet2D.create();
      state.lib.load_point_set2D(pointSet, filename);
      dispatch("getVtkPoints", { pointSet, dimension: 2 }).then(dataset => {
        dispatch("storeObject", {
          type: "PointSet2D",
          representation: "Points",
          cpp: pointSet,
          dataset,
          filename
        });
      });
    },
    loadPointSet3D({ state, dispatch }, filename) {
      let pointSet = new state.lib.PointSet3D.create();
      state.lib.load_point_set3D(pointSet, filename);
      dispatch("getVtkPoints", { pointSet, dimension: 3 }).then(dataset => {
        dispatch("storeObject", {
          type: "PointSet3D",
          representation: "Points",
          cpp: pointSet,
          dataset,
          filename
        });
      });
    },
    loadEdgedCurve2D({ state, dispatch }, filename) {
      let curve = new state.lib.EdgedCurve2D.create();
      state.lib.load_edged_curve2D(curve, filename);
      dispatch("getVtkLines", { curve, dimension: 2 }).then(dataset => {
        dispatch("storeObject", {
          type: "EdgedCurve2D",
          representation: "Wireframe",
          cpp: curve,
          dataset,
          filename
        });
      });
    },
    loadEdgedCurve3D({ state, dispatch }, filename) {
      let curve = new state.lib.EdgedCurve3D.create();
      state.lib.load_edged_curve3D(curve, filename);
      dispatch("getVtkLines", { curve, dimension: 3 }).then(dataset => {
        dispatch("storeObject", {
          type: "EdgedCurve3D",
          representation: "Wireframe",
          cpp: curve,
          dataset,
          filename
        });
      });
    },
    loadPolygonalSurface2D({ state, dispatch }, filename) {
      let surface = new state.lib.PolygonalSurface2D.create();
      state.lib.load_polygonal_surface2D(surface, filename);
      dispatch("getVtkSurface", { surface, dimension: 2 }).then(dataset => {
        dispatch("storeObject", {
          type: "PolygonalSurface2D",
          representation: "Surface with edges",
          cpp: surface,
          dataset,
          filename,
          style: { ...surfaceStyle }
        });
      });
    },
    loadPolygonalSurface3D({ state, dispatch }, filename) {
      let surface = new state.lib.PolygonalSurface3D.create();
      state.lib.load_polygonal_surface3D(surface, filename);
      dispatch("getVtkSurface", { surface, dimension: 3 }).then(dataset => {
        dispatch("storeObject", {
          type: "PolygonalSurface3D",
          representation: "Surface with edges",
          cpp: surface,
          dataset,
          filename,
          style: { ...surfaceStyle }
        });
      });
    },
    loadTriangulatedSurface2D({ state, dispatch }, filename) {
      let surface = new state.lib.TriangulatedSurface2D.create();
      state.lib.load_triangulated_surface2D(surface, filename);
      dispatch("getVtkSurface", { surface, dimension: 2 }).then(dataset => {
        dispatch("storeObject", {
          type: "TriangulatedSurface2D",
          representation: "Surface with edges",
          cpp: surface,
          dataset,
          filename,
          style: { ...surfaceStyle }
        });
      });
    },
    loadTriangulatedSurface3D({ state, dispatch }, filename) {
      let surface = new state.lib.TriangulatedSurface3D.create();
      state.lib.load_triangulated_surface3D(surface, filename);
      dispatch("getVtkSurface", { surface, dimension: 3 }).then(dataset => {
        dispatch("storeObject", {
          type: "TriangulatedSurface3D",
          representation: "Surface with edges",
          cpp: surface,
          dataset,
          filename,
          style: { ...surfaceStyle }
        });
      });
    },
    loadPolyhedralSolid({ state, dispatch }, filename) {
      let solid = new state.lib.PolyhedralSolid3D.create();
      state.lib.load_polyhedral_solid3D(solid, filename);
      dispatch("getVtkSolid", solid).then(dataset => {
        dispatch("storeObject", {
          type: "PolyhedralSolid",
          representation: "Surface with edges",
          cpp: solid,
          dataset,
          filename
        });
      });
    },
    loadTetrahedralSolid({ state, dispatch }, filename) {
      let solid = new state.lib.TetrahedralSolid3D.create();
      state.lib.load_tetrahedral_solid3D(solid, filename);
      dispatch("getVtkSolid", solid).then(dataset => {
        dispatch("storeObject", {
          type: "TetrahedralSolid",
          representation: "Surface with edges",
          cpp: solid,
          dataset,
          filename
        });
      });
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
  store.dispatch("registerObjectType", "PolyhedralSolid");
  store.dispatch("registerObjectType", "TetrahedralSolid");
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
