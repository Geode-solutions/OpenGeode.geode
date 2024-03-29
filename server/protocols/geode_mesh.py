# -*- coding: utf-8 -*-
# Copyright (c) 2019 - 2022 Geode-solutions
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

import os
import uuid

import vtk

import opengeode
import opengeode_io

from geode_protocols import GeodeProtocol

from wslink import register as exportRpc


def importVtkDataset(file):
    reader = None
    if file.endswith(".vtu"):
        reader = vtk.vtkXMLUnstructuredGridReader()
    elif file.endswith(".vtp"):
        reader = vtk.vtkXMLPolyDataReader()
    reader.SetFileName(file)
    reader.Update()
    text_file = open(file, "r")
    data = text_file.read()
    text_file.close()
    os.remove(file)
    return reader.GetOutput(), data


def PointSetToPolydata(points, dimension):
    file = str(uuid.uuid4())+'.vtp'
    getattr(opengeode, 'save_point_set' + str(dimension) + 'D')(points, file)
    return importVtkDataset(file)


def EdgedCurveToPolydata(edges, dimension):
    file = str(uuid.uuid4())+'.vtp'
    getattr(opengeode, 'save_edged_curve' + str(dimension) + 'D')(edges, file)
    return importVtkDataset(file)


def TriangulatedSurfaceToPolydata(surface, dimension):
    file = str(uuid.uuid4())+'.vtp'
    getattr(opengeode, 'save_triangulated_surface' +
            str(dimension) + 'D')(surface, file)
    return importVtkDataset(file)


def PolygonalSurfaceToPolydata(surface, dimension):
    file = str(uuid.uuid4())+'.vtp'
    getattr(opengeode, 'save_polygonal_surface' +
            str(dimension) + 'D')(surface, file)
    return importVtkDataset(file)


def TetrahedralSolidToPolydata(solid, dimension):
    file = str(uuid.uuid4())+'.vtu'
    getattr(opengeode, 'save_tetrahedral_solid' +
            str(dimension) + 'D')(solid, file)
    return importVtkDataset(file)


def PolyhedralSolidToPolydata(solid, dimension):
    file = str(uuid.uuid4())+'.vtu'
    getattr(opengeode, 'save_polyhedral_solid' +
            str(dimension) + 'D')(solid, file)
    return importVtkDataset(file)


def HybridSolidToPolydata(solid, dimension):
    file = str(uuid.uuid4())+'.vtu'
    getattr(opengeode, 'save_hybrid_solid' +
            str(dimension) + 'D')(solid, file)
    return importVtkDataset(file)


class OpenGeodeIOMesh(GeodeProtocol):

    @exportRpc("opengeode.create.point")
    def createPoint(self, name, x, y, z):
        point_set = opengeode.PointSet3D.create()
        builder = opengeode.PointSetBuilder3D.create(point_set)
        builder.create_point(opengeode.Point3D([x, y, z]))
        vtk, vtk_light = PointSetToPolydata(point_set, 3)
        return self.registerObject("PointSet3D", name, point_set, vtk, vtk_light)

    @exportRpc("opengeode.load.point_set2d")
    def loadPointSet2D(self, filename):
        point_set = opengeode.load_point_set2D(filename)
        vtk, vtk_light = PointSetToPolydata(point_set, 2)
        return self.registerObjectFromFile("PointSet2D", filename, point_set, vtk, vtk_light)

    @exportRpc("opengeode.load.point_set3d")
    def loadPointSet3D(self, filename):
        point_set = opengeode.load_point_set3D(filename)
        vtk, vtk_light = PointSetToPolydata(point_set, 3)
        return self.registerObjectFromFile("PointSet3D", filename, point_set, vtk, vtk_light)

    @exportRpc("opengeode.load.edged_curve2d")
    def loadEdgedCurve2D(self, filename):
        edged_curve = opengeode.load_edged_curve2D(filename)
        vtk, vtk_light = EdgedCurveToPolydata(edged_curve, 2)
        return self.registerObjectFromFile("EdgedCurve2D", filename, edged_curve, vtk, vtk_light)

    @exportRpc("opengeode.load.edged_curve3d")
    def loadEdgedCurve3D(self, filename):
        edged_curve = opengeode.load_edged_curve3D(filename)
        vtk, vtk_light = EdgedCurveToPolydata(edged_curve, 3)
        return self.registerObjectFromFile("EdgedCurve3D", filename, edged_curve, vtk, vtk_light)

    @exportRpc("opengeode.load.surface.polygonal2d")
    def loadPolygonalSurface2D(self, filename):
        surface = opengeode.load_polygonal_surface2D(filename)
        vtk, vtk_light = PolygonalSurfaceToPolydata(surface, 2)
        return self.registerObjectFromFile("PolygonalSurface2D", filename, surface, vtk, vtk_light)

    @exportRpc("opengeode.load.surface.polygonal3d")
    def loadPolygonalSurface3D(self, filename):
        surface = opengeode.load_polygonal_surface3D(filename)
        vtk, vtk_light = PolygonalSurfaceToPolydata(surface, 3)
        return self.registerObjectFromFile("PolygonalSurface3D", filename, surface, vtk, vtk_light)

    @exportRpc("opengeode.load.surface.triangulated2d")
    def loadTriangulatedSurface2D(self, filename):
        surface = opengeode.load_triangulated_surface2D(filename)
        vtk, vtk_light = TriangulatedSurfaceToPolydata(surface, 2)
        return self.registerObjectFromFile("TriangulatedSurface2D", filename, surface, vtk, vtk_light)

    @exportRpc("opengeode.load.surface.triangulated3d")
    def loadTriangulatedSurface3D(self, filename):
        surface = opengeode.load_triangulated_surface3D(filename)
        vtk, vtk_light = TriangulatedSurfaceToPolydata(surface, 3)
        return self.registerObjectFromFile("TriangulatedSurface3D", filename, surface, vtk, vtk_light)

    @exportRpc("opengeode.load.solid.polyhedral3d")
    def loadPolyhedralSolid3D(self, filename):
        solid = opengeode.load_polyhedral_solid3D(filename)
        vtk, vtk_light = PolyhedralSolidToPolydata(solid, 3)
        return self.registerObjectFromFile("PolyhedralSolid3D", filename, solid, vtk, vtk_light)

    @exportRpc("opengeode.load.solid.tetrahedral3d")
    def loadTetrahedralSolid3D(self, filename):
        solid = opengeode.load_tetrahedral_solid3D(filename)
        vtk, vtk_light = TetrahedralSolidToPolydata(solid, 3)
        return self.registerObjectFromFile("TetrahedralSolid3D", filename, solid, vtk, vtk_light)

    @exportRpc("opengeode.edge.visibility")
    def setEdgeVisibility(self, id, visibility):
        actor = self.getObject(id)["actor"]
        actor.GetProperty().SetEdgeVisibility(visibility)
        self.render()

    @exportRpc("opengeode.point.visibility")
    def setPointVisibility(self, id, visibility):
        actor = self.getObject(id)["actor"]
        actor.GetProperty().SetVertexVisibility(visibility)
        self.render()

    @exportRpc("opengeode.point.size")
    def setPointSize(self, id, size):
        actor = self.getObject(id)["actor"]
        actor.GetProperty().SetPointSize(size)
        self.render()

    def clearColors(self, id):
        store = self.getObject(id)
        vtk = store["vtk"]
        vtk.GetPointData().SetActiveScalars("")
        vtk.GetCellData().SetActiveScalars("")
        store["mapper"].ScalarVisibilityOff()

    @exportRpc("opengeode.color")
    def setColor(self, id, color):
        self.clearColors(id)
        actor = self.getObject(id)["actor"]
        actor.GetProperty().SetColor(color)
        self.render()

    @exportRpc("opengeode.attribute.vertex.names")
    def getVertexAttributeNames(self, id):
        cpp = self.getObject(id)["cpp"]
        return cpp.vertex_attribute_manager().attribute_names()

    def computeAttributeData(self, manager, name):
        attribute = manager.find_generic_attribute(name)
        data = vtk.vtkFloatArray()
        data.SetName(name)
        data.SetNumberOfTuples(manager.nb_elements())
        print(manager.nb_elements())
        for i in range(manager.nb_elements()):
            value = attribute.generic_value(i)
            if value == opengeode.NO_ID:
                data.SetValue(i, float('nan'))
            else:
                data.SetValue(i, value)
        return data

    @exportRpc("opengeode.attribute.vertex")
    def setVertexAttribute(self, id, name):
        store = self.getObject(id)
        cpp = store["cpp"]
        points = store["vtk"].GetPointData()
        manager = cpp.vertex_attribute_manager()
        if not manager.attribute_exists(name):
            return
        if not points.HasArray(name):
            data = self.computeAttributeData(manager, name)
            points.AddArray(data)
        points.SetActiveScalars(name)
        mapper = store["mapper"]
        mapper.ScalarVisibilityOn()
        mapper.SetScalarModeToUsePointData()
        mapper.SetScalarRange(points.GetScalars().GetRange())
        self.render()

    @exportRpc("opengeode.attribute.polygon")
    def setPolygonAttribute(self, id, name):
        store = self.getObject(id)
        cpp = store["cpp"]
        print(cpp.nb_polygons())
        cells = store["vtk"].GetCellData()
        print(store["vtk"].GetNumberOfCells())
        manager = cpp.polygon_attribute_manager()
        if not manager.attribute_exists(name):
            return
        if not cells.HasArray(name):
            data = self.computeAttributeData(manager, name)
            cells.AddArray(data)
        cells.SetActiveScalars(name)
        mapper = store["mapper"]
        mapper.ScalarVisibilityOn()
        mapper.SetScalarModeToUseCellData()
        mapper.SetScalarRange(cells.GetScalars().GetRange())
        self.render()

    @exportRpc("opengeode.attribute.polygon.names")
    def getPolygonAttributeNames(self, id):
        cpp = self.getObject(id)["cpp"]
        return cpp.polygon_attribute_manager().attribute_names()


protocols = [OpenGeodeIOMesh]
