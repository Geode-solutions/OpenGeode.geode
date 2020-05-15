import os 

from vtk.web.protocols import vtkWebProtocol
import vtk

from wslink import register as exportRpc

from uuid import uuid4 as uuid

import opengeode_py_basic as basic
import opengeode_py_geometry as geom

class OpenGeodeProtocol(vtkWebProtocol):
    def getDataBase(self):
        return self.getSharedObject("db")

    def getRenderer(self):
        return self.getSharedObject("renderer")

    def getObject(self, id):
        return self.getDataBase()[id]
    
    def getProtocol(self, name):
        for p in self.coreServer.getLinkProtocols():
            if(type(p).__name__ == name):
                return p

    def render(self, view = -1):
        self.getProtocol("vtkWebPublishImageDelivery").imagePush({"view": view})

    def registerObjectFromFile(self, type, filename, cpp, vtk_object, vtk_light):
        print(filename)
        name = os.path.basename(filename)
        return self.registerObject(type, name, cpp, vtk_object, vtk_light)

    def bbox(self, actor):
        bounds = actor.GetBounds()
        bbox = geom.BoundingBox3D()
        bbox.add_point(geom.Point3D([bounds[0], bounds[2], bounds[4]]))
        bbox.add_point(geom.Point3D([bounds[1], bounds[3], bounds[5]]))
        return bbox
    
    def addVTKObject(self, vtk_object):
        mapper = vtk.vtkPolyDataMapper()
        actor = vtk.vtkActor()
        mapper.SetInputData(vtk_object)
        mapper.SetColorModeToMapScalars()
        mapper.SetResolveCoincidentTopologyLineOffsetParameters(1,-0.1)
        mapper.SetResolveCoincidentTopologyPolygonOffsetParameters(2,0)
        mapper.SetResolveCoincidentTopologyPointOffsetParameter(-2)
        actor.SetMapper(mapper)
        self.getRenderer().AddActor(actor)
        return mapper, actor

    def registerObject(self, object_type, name, cpp, vtk_object, vtk_light):
        if type(vtk_object) is dict:
            mapper = {}
            actor = {}
            bbox = geom.BoundingBox3D()
            for key, components in vtk_object.items():
                print(key)
                mapper[key] = {}
                actor[key] = {}
                for id, polydata in components.items():
                    object_mapper, object_actor = self.addVTKObject(polydata)
                    if polydata.GetNumberOfPoints() != 0:
                        bbox.add_box(self.bbox(object_actor))
                    mapper[key][id] = object_mapper
                    actor[key][id] = object_actor
        else:
            mapper, actor = self.addVTKObject(vtk_object)
            bbox = self.bbox(actor)
        id = str(uuid())
        print(id)
        self.getDataBase()[id] = {
            "type": object_type, 
            "name": name, 
            "cpp": cpp, 
            "bbox": bbox,
            "vtk": vtk_object, 
            "actor": actor,
            "mapper": mapper
        }
        return {"id": id, "name": name, "type": object_type, "data": vtk_light}

