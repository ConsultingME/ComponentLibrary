({
	onClickClose: function (component, event, helper) {
		var idx = event.getSource().get("v.value");
		var alerts = component.get("v.alerts");
		alerts.splice(idx, 1);
		component.set("v.alerts", alerts);
	}
})