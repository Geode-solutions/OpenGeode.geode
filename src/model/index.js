/*
 * Copyright (c) 2019 - 2020 Geode-solutions
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
import Store from "./store";

export default function(store) {
  store.registerModule("model", Store);
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