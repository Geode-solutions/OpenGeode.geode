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

import ToggleCorners from "./components/ToggleCorners";
import CornersSize from "./components/CornersSize";
import CornersColor from "./components/CornersColor";
import ToggleLines from "./components/ToggleLines";
import LinesColor from "./components/LinesColor";
import ToggleSurfaces from "./components/ToggleSurfaces";
import SurfacesMesh from "./components/SurfacesMesh";
import SurfacesColor from "./components/SurfacesColor";
import LogoModel from "@/assets/model.svg";
import LogoBRep from "@/assets/brep.svg";

const modelStore = {
  namespaced: true,
  state: {},
  actions: {
    loadBRep({ state, dispatch }, filename) {
      let brep = new state.lib.BRep();
      state.lib.load_brep(brep, filename);

      let vtk = {
        corners: [],
        lines: [],
        surfaces: [],
        blocks: []
      };
      let promises = [];
      let corners = brep.corners();
      for (let it = corners.begin(); it.different(corners.end()); it.next()) {
        promises.push(
          new Promise(resolve =>
            dispatch(
              "mesh/getVtkPoints",
              { pointSet: it.get().mesh(), dimension: 3 },
              { root: true }
            ).then(dataset => {
              vtk.corners.push(dataset);
              resolve();
            })
          )
        );
      }
      let lines = brep.lines();
      for (let it = lines.begin(); it.different(lines.end()); it.next()) {
        promises.push(
          new Promise(resolve =>
            dispatch(
              "mesh/getVtkLines",
              { curve: it.get().mesh(), dimension: 3 },
              { root: true }
            ).then(dataset => {
              vtk.lines.push(dataset);
              resolve();
            })
          )
        );
      }
      let surfaces = brep.surfaces();
      for (let it = surfaces.begin(); it.different(surfaces.end()); it.next()) {
        promises.push(
          new Promise(resolve =>
            dispatch(
              "mesh/getVtkSurface",
              { surface: it.get().mesh(), dimension: 3 },
              { root: true }
            ).then(dataset => {
              vtk.surfaces.push(dataset);
              resolve();
            })
          )
        );
      }
      /*
          let blocks = brep.blocks();
          for (let it = blocks.begin(); it.different( blocks.end() ); it.next() ) {
              let dataset = vtkPolyData.newInstance();
              getVtkPoints(dataset, it.get().mesh(), 3);
              vtk.blocks.push(dataset);
          }
          */

      let style = {
        corners: { visible: true, size: 1, color: [1, 1, 1] },
        lines: { visible: true, color: [1, 1, 1] },
        surfaces: { visible: true, color: [1, 1, 1], mesh: { visible: false } },
        blocks: []
      };

      Promise.all(promises).then(() =>
        dispatch(
          "addObject",
          {
            type: "BRep",
            name: filename.replace(/^.*[\\\/]/, "").replace(/\.[^/.]+$/, ""),
            cpp: brep,
            vtk,
            style
          },
          { root: true }
        )
      );
    }
  }
};

export default function(store) {
  store.registerModule("model", modelStore);
  store.dispatch("registerObjectType", "BRep");
  store.commit("ui/registerInputItem", {
    parent: "import",
    name: "model",
    component: LogoModel,
    tooltip: "Import model"
  });
  store.commit("ui/registerInputItem", {
    parent: "model",
    name: "brep",
    component: LogoBRep,
    action: "model/loadBRep",
    tooltip: "Import BRep"
  });
  store.commit("ui/registerContextualItem", {
    type: "BRep",
    component: ToggleCorners
  });
  store.commit("ui/registerContextualItem", {
    type: "BRep",
    component: CornersSize
  });
  store.commit("ui/registerContextualItem", {
    type: "BRep",
    component: CornersColor
  });
  store.commit("ui/registerContextualItem", {
    type: "BRep",
    component: ToggleLines
  });
  store.commit("ui/registerContextualItem", {
    type: "BRep",
    component: LinesColor
  });
  store.commit("ui/registerContextualItem", {
    type: "BRep",
    component: ToggleSurfaces
  });
  store.commit("ui/registerContextualItem", {
    type: "BRep",
    component: SurfacesMesh
  });
  store.commit("ui/registerContextualItem", {
    type: "BRep",
    component: SurfacesColor
  });
}
