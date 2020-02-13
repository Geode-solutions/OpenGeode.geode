import vtk

import opengeode_py_basic as basic
import opengeode_py_mesh as mesh

import opengeode_geode_py_mesh as geode_mesh

from geode_protocols import OpenGeodeProtocol

from wslink import register as exportRpc

class OpenGeodeIOMesh(OpenGeodeProtocol):
    def SurfaceToPolydata(self, surface):
        polydata = vtk.vtkPolyData()
        geode_mesh.convert_surface2d_to_polydata(surface, polydata)
        print(polydata)
        return polydata

    @exportRpc("opengeode.load.surface.triangulated2d")
    def loadTriangulatedSurface2D(self, filename):
        print(filename)
        surface = mesh.TriangulatedSurface2D.create()
        mesh.load_triangulated_surface2D(surface,filename)
        vtk = self.SurfaceToPolydata(surface)
        return self.registerObjectFromFile("TriangulatedSurface2D",filename, surface, vtk)

protocols = [OpenGeodeIOMesh]