import vtk

import opengeode_py_basic as basic
import opengeode_py_geometry
import opengeode_py_mesh as mesh

import opengeode_geode_py_mesh as geode_mesh

from geode_protocols import GeodeProtocol

from wslink import register as exportRpc

def PointSetToPolydata(points, dimension):
    polydata = vtk.vtkPolyData()
    getattr(geode_mesh, 'convert_point_set_to_polydata' + str(dimension) + 'D')(points, polydata)
    return polydata

def EdgedCurveToPolydata(edges, dimension):
    polydata = vtk.vtkPolyData()
    getattr(geode_mesh, 'convert_edged_curve_to_polydata' + str(dimension) + 'D')(edges, polydata)
    return polydata

def SurfaceToPolydata(surface, dimension):
    polydata = vtk.vtkPolyData()
    getattr(geode_mesh, 'convert_surface_to_polydata' + str(dimension) + 'D')(surface, polydata)
    return polydata

def SolidToPolydata(solid, dimension):
    polydata = vtk.vtkPolyData()
    getattr(geode_mesh, 'convert_solid_to_polydata' + str(dimension) + 'D')(solid, polydata)
    return polydata

class OpenGeodeIOMesh(GeodeProtocol):

    @exportRpc("opengeode.load.point_set2d")
    def loadPointSet2D(self, filename):
        point_set = mesh.PointSet2D.create()
        mesh.load_point_set2D(point_set,filename)
        vtk = PointSetToPolydata(point_set, 2)
        vtk_light = geode_mesh.extract_point_set_points2D(point_set)
        return self.registerObjectFromFile("PointSet2D",filename, point_set, vtk, vtk_light)

    @exportRpc("opengeode.load.point_set3d")
    def loadPointSet3D(self, filename):
        point_set = mesh.PointSet3D.create()
        mesh.load_point_set3D(point_set,filename)
        vtk = PointSetToPolydata(point_set, 3)
        vtk_light = geode_mesh.extract_point_set_points3D(point_set)
        return self.registerObjectFromFile("PointSet3D",filename, point_set, vtk, vtk_light)

    @exportRpc("opengeode.load.edged_curve2d")
    def loadEdgedCurve2D(self, filename):
        edged_curve = mesh.EdgedCurve2D.create()
        mesh.load_edged_curve2D(edged_curve,filename)
        vtk = EdgedCurveToPolydata(edged_curve, 2)
        vtk_light = geode_mesh.extract_edged_curve_edges2D(edged_curve)
        return self.registerObjectFromFile("EdgedCurve2D",filename, edged_curve, vtk, vtk_light)

    @exportRpc("opengeode.load.edged_curve3d")
    def loadEdgedCurve3D(self, filename):
        edged_curve = mesh.EdgedCurve3D.create()
        mesh.load_edged_curve3D(edged_curve,filename)
        vtk = EdgedCurveToPolydata(edged_curve, 3)
        vtk_light = geode_mesh.extract_edged_curve_edges3D(edged_curve)
        return self.registerObjectFromFile("EdgedCurve3D",filename, edged_curve, vtk, vtk_light)

    @exportRpc("opengeode.load.surface.polygonal2d")
    def loadPolygonalSurface2D(self, filename):
        surface = mesh.PolygonalSurface2D.create()
        mesh.load_polygonal_surface2D(surface,filename)
        vtk = SurfaceToPolydata(surface, 2)
        vtk_light = geode_mesh.extract_surface_wireframe2D(surface)
        return self.registerObjectFromFile("PolygonalSurface2D",filename, surface, vtk, vtk_light)

    @exportRpc("opengeode.load.surface.polygonal3d")
    def loadPolygonalSurface3D(self, filename):
        surface = mesh.PolygonalSurface3D.create()
        mesh.load_polygonal_surface3D(surface,filename)
        vtk = SurfaceToPolydata(surface, 3)
        vtk_light = geode_mesh.extract_surface_wireframe3D(surface)
        return self.registerObjectFromFile("PolygonalSurface3D",filename, surface, vtk, vtk_light)

    @exportRpc("opengeode.load.surface.triangulated2d")
    def loadTriangulatedSurface2D(self, filename):
        surface = mesh.TriangulatedSurface2D.create()
        mesh.load_triangulated_surface2D(surface,filename)
        vtk = SurfaceToPolydata(surface, 2)
        vtk_light = geode_mesh.extract_surface_wireframe2D(surface)
        return self.registerObjectFromFile("TriangulatedSurface2D",filename, surface, vtk, vtk_light)

    @exportRpc("opengeode.load.surface.triangulated3d")
    def loadTriangulatedSurface3D(self, filename):
        surface = mesh.TriangulatedSurface3D.create()
        mesh.load_triangulated_surface3D(surface,filename)
        vtk = SurfaceToPolydata(surface, 3)
        vtk_light = geode_mesh.extract_surface_wireframe3D(surface)
        return self.registerObjectFromFile("TriangulatedSurface3D",filename, surface, vtk, vtk_light)

    @exportRpc("opengeode.load.solid.polyhedral3d")
    def loadPolyhedralSolid3D(self, filename):
        solid = mesh.PolyhedralSolid3D.create()
        mesh.load_polyhedral_solid3D(solid,filename)
        vtk = SolidToPolydata(solid, 3)
        vtk_light = geode_mesh.extract_solid_wireframe3D(solid)
        return self.registerObjectFromFile("PolyhedralSolid3D",filename, solid, vtk, vtk_light)

    @exportRpc("opengeode.load.solid.tetrahedral3d")
    def loadTetrahedralSolid3D(self, filename):
        solid = mesh.TetrahedralSolid3D.create()
        mesh.load_tetrahedral_solid3D(solid,filename)
        vtk = SolidToPolydata(solid, 3)
        vtk_light = geode_mesh.extract_solid_wireframe3D(solid)
        return self.registerObjectFromFile("TetrahedralSolid3D",filename, solid, vtk, vtk_light)

    @exportRpc("opengeode.edge.visibility")
    def setEdgeVisibility(self, id, visibility):
        actor = self.getObject(id)["actor"]
        actor.GetProperty().SetEdgeVisibility(visibility)
        self.render()

    @exportRpc("opengeode.points.size")
    def setPointsSize(self, id, size):
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
            data.SetValue(i,attribute.generic_value(i))
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
        mapper.SetScalarModeToUseCellData()
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