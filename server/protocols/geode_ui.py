import vtk

from wslink import register as exportRpc

from geode_protocols import OpenGeodeProtocol

class OpenGeodeUI(OpenGeodeProtocol):
    @exportRpc("opengeode.ui.background")
    def setBackground(self, viewId, r, g, b):
        self.getSharedObject("renderer").SetBackground(r,g,b)
        view = self.getView(viewId)
        view.Render()
        self.getApplication().InvokeEvent('UpdateEvent')

    @exportRpc("opengeode.ui.test")
    def test(self):
        axes = vtk.vtkAxesActor()
        widget = vtk.vtkOrientationMarkerWidget()
        widget.SetOrientationMarker(axes)
        # widget.SetOrientationMarker(self.north())
        widget.SetInteractor(self.getSharedObject("test"))
        widget.SetViewport( 0.1, 0.1, 0.9, 0.9 )
        # widget.SetOutlineColor( 0.9300, 0.5700, 0.1300 )
        # widget->SetOutlineColor(colors->GetColor3d("Wheat").GetRed(),
        #                         colors->GetColor3d("Wheat").GetGreen(),
        #                         colors->GetColor3d("Wheat").GetBlue());
        widget.EnabledOn()
        widget.InteractiveOn()
        print("widget")


    @exportRpc("opengeode.actor.visibility")
    def updateVisibility(self, id, visibility):
        actor = self.getObject(id)["actor"]
        if type(actor) is dict:
            for components in actor.values():
                for object_actor in components.values():
                    object_actor.SetVisibility(visibility)
        else:
            actor.SetVisibility(visibility)
        self.render()

    @exportRpc("opengeode.camera.reset")
    def fastResetCamera(self, viewId):
        view = self.getView(viewId)
        view.GetRenderers().GetFirstRenderer().ResetCamera()
        self.render()

    @exportRpc("opengeode.camera.update")
    def fastUpdateCamera(self, view_id, focal_point, view_up, position, view_angle, clipping_range):
        view = self.getView(view_id)
        camera = view.GetRenderers().GetFirstRenderer().GetActiveCamera()
        camera.SetFocalPoint(focal_point)
        camera.SetViewUp(view_up)
        camera.SetPosition(position)
        camera.SetViewAngle(view_angle)
        camera.SetClippingRange(clipping_range)
        self.render()

    @exportRpc("opengeode.marker.geometry")
    def setMarkerGeometry(self, content):
        reader = vtk.vtkXMLPolyDataReader()
        reader.ReadFromInputStringOn()
        reader.SetInputString(content)
        mapper = vtk.vtkPolyDataMapper()
        mapper.SetInputConnection(reader.GetOutputPort())
        actor = vtk.vtkActor()
        actor.SetMapper(mapper)
        widget = self.getSharedObject("marker")
        widget.SetOrientationMarker( actor )
        widget.EnabledOn()

    @exportRpc("opengeode.marker.viewport")
    def setMarkerViewport(self, viewport):
        widget = self.getSharedObject("marker")
        widget.SetViewport( viewport )

    @exportRpc("opengeode.reset")
    def reset(self):
        self.getDataBase().clear()
        self.getRenderer().RemoveAllViewProps()

protocols = [OpenGeodeUI]