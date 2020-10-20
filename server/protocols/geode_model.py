# -*- coding: utf-8 -*-
# Copyright (c) 2019 - 2020 Geode-solutions
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import vtk

import opengeode
import opengeode_geode
import geode_mesh as mesh

from geode_protocols import GeodeProtocol

from wslink import register as exportRpc

def cornersToPolydata(corners, dimension):
    print("corners")
    vtk = {}
    for corner in corners:
        vtk[corner.id().string()] = mesh.PointSetToPolydata(corner.mesh(), dimension)
    return vtk

def linesToPolydata(lines, dimension):
    print("lines")
    vtk = {}
    for line in lines:
        vtk[line.id().string()] = mesh.EdgedCurveToPolydata(line.mesh(), dimension)
    return vtk

def surfacesToPolydata(surfaces, dimension):
    print("surfaces")
    vtk = {}
    for surface in surfaces:
        vtk[surface.id().string()] = mesh.SurfaceToPolydata(surface.mesh(), dimension)
    return vtk

def blocksToPolydata(blocks, dimension):
    print("blocks")
    vtk = {}
    for block in blocks:
        vtk[block.id().string()] = mesh.SolidToPolydata(block.mesh(), dimension)
    return vtk

def brepToVTK(brep):
    vtk = {
        "corners": cornersToPolydata(brep.corners(), 3),
        "lines": linesToPolydata(brep.lines(), 3),
        "surfaces": surfacesToPolydata(brep.surfaces(), 3),
        "blocks": blocksToPolydata(brep.blocks(), 3)
    }
    vtk_light = opengeode_geode.export_brep_lines(brep)
    return vtk, vtk_light


class OpenGeodeIOModel(GeodeProtocol):
    @exportRpc("opengeode.load.brep")
    def loadBRep(self, filename):
        brep = opengeode.BRep()
        opengeode.load_brep(brep,filename)
        vtk, vtk_light = brepToVTK(brep)
        return self.registerObjectFromFile("BRep",filename, brep, vtk, vtk_light)

    @exportRpc("opengeode.model.mesh.visibility")
    def setModelMeshVisibility(self, id, object_type, visibility):
        actor = self.getObject(id)["actor"]
        for object_actor in actor[object_type].values():
            object_actor.GetProperty().SetEdgeVisibility(visibility)
        self.render()

    @exportRpc("opengeode.model.components.visibility")
    def setModelComponentsVisibility(self, id, object_type, visibility):
        actor = self.getObject(id)["actor"]
        for object_actor in actor[object_type].values():
            object_actor.SetVisibility(visibility)
        self.render()

    @exportRpc("opengeode.model.components.color")
    def setModelComponentsColor(self, id, object_type, color):
        actor = self.getObject(id)["actor"]
        for object_actor in actor[object_type].values():
            object_actor.GetProperty().SetColor(color)
        self.render()

    @exportRpc("opengeode.model.corners.size")
    def setModelCornersSize(self, id, size):
        actor = self.getObject(id)["actor"]
        for object_actor in actor["corners"].values():
            object_actor.GetProperty().SetPointSize(size)
        self.render()


protocols = [OpenGeodeIOModel]