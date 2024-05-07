import express,{type Request, type Response, type Router} from 'express';
import User from "../models/User"
import type { User as userShema } from "../types/interfaces"

const router: Router = express.Router();


router.get('/', async (_, res: Response) => {
    try {
        const users: Array<userShema> = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({
            status: res.statusCode,
            message: 'no users found',
        })
    }
});

router.get('/:id',async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({
            status: res.statusCode,
            message: 'no user found'
        });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const newUser = await user.save();
        res.json(newUser);
    } catch (err) {
        res.status(500).json({ 
            status: res.statusCode,
            message: 'user not created' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;
            const updatedUser = await user.save();
            res.json(updatedUser);
        }
    } catch (err) {
        res.status(500).json({ 
            status: res.statusCode,
            message: 'user not updated' })
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ 
                status: res.statusCode,
                message: 'user removed' });
        }
    } catch (err) {
        res.status(500).json({ message: 'user not removed' });
    }
});

export default router;