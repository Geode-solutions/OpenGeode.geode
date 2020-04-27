import vtk

import opengeode_py_basic as basic
import opengeode_py_geometry
import opengeode_py_mesh as mesh
import opengeode_py_model as model

import opengeode_geode_py_mesh as py_mesh
import opengeode_geode_py_model as py_model

from geode_protocols import OpenGeodeProtocol
import geode_mesh 

from wslink import register as exportRpc

def cornersToPolydata(corners, dimension):
    print("corners")
    vtk = {}
    for corner in corners:
        vtk[corner.id().string()] = geode_mesh.PointSetToPolydata(corner.mesh(), dimension)
    return vtk

def linesToPolydata(lines, dimension):
    print("lines")
    vtk = {}
    for line in lines:
        vtk[line.id().string()] = geode_mesh.EdgedCurveToPolydata(line.mesh(), dimension)
    return vtk

def surfacesToPolydata(surfaces, dimension):
    print("surfaces")
    vtk = {}
    for surface in surfaces:
        vtk[surface.id().string()] = geode_mesh.SurfaceToPolydata(surface.mesh(), dimension)
    return vtk

def blocksToPolydata(blocks, dimension):
    print("blocks")
    vtk = {}
    for block in blocks:
        vtk[block.id().string()] = geode_mesh.SolidToPolydata(block.mesh(), dimension)
    return vtk

class OpenGeodeIOModel(OpenGeodeProtocol):
    @exportRpc("opengeode.load.brep")
    def loadBRep(self, filename):
        brep = model.BRep()
        model.load_brep(brep,filename)
        vtk = {
            "corners": cornersToPolydata(brep.corners(), 3),
            "lines": linesToPolydata(brep.lines(), 3),
            "surfaces": surfacesToPolydata(brep.surfaces(), 3),
            "blocks": blocksToPolydata(brep.blocks(), 3)
        }
        vtk_light = py_model.export_brep_lines(brep)
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