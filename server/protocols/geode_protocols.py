import os 

from vtk.web.protocols import vtkWebProtocol
import vtk

from wslink import register as exportRpc

from uuid import uuid4 as uuid

class OpenGeodeProtocol(vtkWebProtocol):
    def getDataBase(self):
        return self.getSharedObject("db")

    def registerObjectFromFile(self, type, filename, cpp, vtk_object):
        name = os.path.basename(filename)
        return self.registerObject(type, name, cpp, vtk_object)

    def registerObject(self, type, name, cpp, vtk_object):
        mapper = vtk.vtkPolyDataMapper()
        actor = vtk.vtkActor()
        mapper.SetInputData(vtk_object)
        actor.SetMapper(mapper)
        self.getSharedObject("renderer").AddActor(actor)
        id = str(uuid())
        self.getDataBase()[id] = {"type":type, "name":name, "cpp":cpp, "vtk":vtk_object}
        return {"id":id, "name": name, "type": type}

