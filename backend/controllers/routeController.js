const Route = require("../models/Route")

const createRoute = async (req, res) => {
    try {
        const routeId = await Route.create(req.body)
        res.status(201).json({ message: "Route created successfully", routeId })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getRoutes = async (req, res) => {
    try {
        const routes = await Route.getAll()
        res.json(routes)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getRoute = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id)
        if(!route) {
            return res.status(404).json({ message: "Route not found" })
        }
        res.json(route)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const updateRoute = async (req, res) => {
    try {
        await Route.update(req.params.id, req.body)
        res.json({ message: "Route updated successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const deleteRoute = async (req, res) => {
    try {
        await Route.delete(req.params.id)
        res.json({ message: "Route deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}


module.exports = {
    createRoute,
    getRoutes,
    getRoute,
    updateRoute,
    deleteRoute
}
