import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';

export class AdminController {
  constructor(private adminService: AdminService) {}

  getStats = async (req: Request, res: Response) => {
    try { res.json(await this.adminService.getStats()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  };

  // ── Produits ───────────────────────────────────
  getProducts = async (req: Request, res: Response) => {
    try { res.json(await this.adminService.getProducts()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  };

  createProduct = async (req: Request, res: Response) => {
    try { res.status(201).json(await this.adminService.createProduct(req.body)); }
    catch (e: any) { res.status(400).json({ error: e.message }); }
  };

  updateProduct = async (req: Request, res: Response) => {
    try { res.json(await this.adminService.updateProduct(req.params.id, req.body)); }
    catch (e: any) { res.status(400).json({ error: e.message }); }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try { await this.adminService.deleteProduct(req.params.id); res.status(204).send(); }
    catch (e: any) { res.status(400).json({ error: e.message }); }
  };

  // ── Catégories ─────────────────────────────────
  getCategories = async (req: Request, res: Response) => {
    try { res.json(await this.adminService.getCategories()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  };

  createCategory = async (req: Request, res: Response) => {
    try { res.status(201).json(await this.adminService.createCategory(req.body)); }
    catch (e: any) { res.status(400).json({ error: e.message }); }
  };

   updateCategory = async (req: Request, res: Response) => {
    try { res.json(await this.adminService.updateCategory(req.params.id, req.body)); }
    catch (e: any) { res.status(400).json({ error: e.message }); }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try { await this.adminService.deleteCategory(req.params.id); res.status(204).send(); }
    catch (e: any) { res.status(400).json({ error: e.message }); }
  };

  // ── Commandes ──────────────────────────────────
  getOrders = async (req: Request, res: Response) => {
    try { res.json(await this.adminService.getOrders()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  };

  updateOrderStatus = async (req: Request, res: Response) => {
    try { res.json(await this.adminService.updateOrderStatus(req.params.id, req.body.status)); }
    catch (e: any) { res.status(400).json({ error: e.message }); }
  };

  // ── Utilisateurs ───────────────────────────────
  getUsers = async (req: Request, res: Response) => {
    try { res.json(await this.adminService.getUsers()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  };

  deleteUser = async (req: Request, res: Response) => {
    try { await this.adminService.deleteUser(req.params.id); res.status(204).send(); }
    catch (e: any) { res.status(400).json({ error: e.message }); }
  };
}