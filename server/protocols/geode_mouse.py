import math

import vtk

from wslink import register as exportRpc

from geode_protocols import OpenGeodeProtocol

import opengeode_py_basic as basic
import opengeode_py_geometry as geom

class OpenGeodeMouseHandler(OpenGeodeProtocol):
    def computeEpsilon(self,renderer, z):
        renderer.SetDisplayPoint(0, 0, z)
        renderer.DisplayToWorld()
        windowLowerLeft = renderer.GetWorldPoint()
        size = renderer.GetRenderWindow().GetSize()
        renderer.SetDisplayPoint(size[0], size[1], z)
        renderer.DisplayToWorld()
        windowUpperRight = renderer.GetWorldPoint()
        epsilon = 0
        for i in range(3):
            epsilon += (windowUpperRight[i] - windowLowerLeft[i]) * (windowUpperRight[i] - windowLowerLeft[i])
        return math.sqrt(epsilon) * 0.0125

    @exportRpc("opengeode.mouse.menu")
    def menu(self, x, y, ids):
        renderer = self.getRenderer()
        picker = vtk.vtkWorldPointPicker()
        ret = picker.Pick([x,y,0],renderer)
        point = picker.GetPickPosition()
        epsilon = self.computeEpsilon(renderer, point[2])
        bbox = geom.BoundingBox3D()
        bbox.add_point(geom.Point3D([point[0]+epsilon,point[1]+epsilon,point[2]+epsilon]))
        bbox.add_point(geom.Point3D([point[0]-epsilon,point[1]-epsilon,point[2]-epsilon]))
        for id in ids:
            if self.getObject(id)['bbox'].intersects(bbox):
                return id
        return 0

    @exportRpc("opengeode.mouse.wheel")
    def mouseInteraction(self, event):
        """
        RPC Callback for mouse interactions.
        """
        view = self.getView(event['view'])
        scroll = 0
        if event["type"] != "EndMouseWheel":
            scroll = event["spinY"]
        pvevent = vtk.vtkWebInteractionEvent()
        pvevent.SetScroll(scroll)
        retVal = self.getApplication().HandleInteractionEvent(view, pvevent)
        del pvevent
        if retVal:
            self.getApplication().InvokeEvent('UpdateEvent')
        return retVal

protocols = [OpenGeodeMouseHandler]