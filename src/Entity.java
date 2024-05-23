abstract class Entity {
    protected int x, y;
    protected int size;
    protected double speed;

    public Entity(int x, int y, int size, double speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
    }

    public abstract void update();

    public void draw(Graphics g) {
        g.fillRect(x, y, size, size);
    }
}
