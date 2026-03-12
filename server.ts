import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Client Initialization
const supabaseUrl = process.env.SUPABASE_URL || "https://mrwjjdywjwvzrdkgwbtm.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_KQwgJGP966yI6WH6W4XvNA_veuCwEq7";
const supabase = createClient(supabaseUrl, supabaseKey);

// Default settings for seeding
const defaultSettings = [
  { key: "school_name", value: "United Secondary School" },
  { key: "tagline", value: "We Make The Nation United" },
  { key: "hero_title", value: "Welcome to United Secondary School" },
  { key: "hero_subtitle", value: "\"Providing Quality Education from Montessori to Matric\"" },
  { key: "about_text", value: "United Secondary School is committed to providing quality education in a safe and inspiring learning environment. Our goal is to prepare students for academic excellence and responsible citizenship." },
  { key: "phone", value: "+92 312 2898429" },
  { key: "email", value: "info@uss.edu.pk" },
  { key: "address", value: "Main Campus, United Secondary School, City, Country" },
  { key: "logo_path", value: "/favicon.ico" },
  { key: "hero_image", value: "https://picsum.photos/seed/school-campus/1920/1080" },
];

async function seedSupabase() {
  try {
    const { data, error } = await supabase.from("site_settings").select("key");
    if (error) {
      console.error("Error checking settings for seeding:", error.message);
      return;
    }
    if (data.length === 0) {
      console.log("Seeding default settings to Supabase...");
      const { error: insertError } = await supabase.from("site_settings").insert(defaultSettings);
      if (insertError) console.error("Error seeding settings:", insertError.message);
      else console.log("Default settings seeded successfully.");
    }
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

async function startServer() {
  await seedSupabase();
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Multer config for memory storage (for Supabase uploads)
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  // API Routes
  app.get("/api/settings", async (req, res) => {
    const { data, error } = await supabase.from("site_settings").select("*");
    if (error) return res.status(500).json({ error: error.message });
    
    const settingsObj = data.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    res.json(settingsObj);
  });

  app.post("/api/settings", async (req, res) => {
    const updates = req.body;
    const upsertData = Object.entries(updates).map(([key, value]) => ({ key, value }));
    
    const { error } = await supabase.from("site_settings").upsert(upsertData);
    if (error) return res.status(500).json({ error: error.message });
    
    res.json({ success: true });
  });

  app.post("/api/upload", upload.single("image"), async (req: any, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const { data, error } = await supabase.storage
      .from("uss-assets")
      .upload(`images/${fileName}`, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (error) return res.status(500).json({ error: error.message });

    const { data: { publicUrl } } = supabase.storage
      .from("uss-assets")
      .getPublicUrl(`images/${fileName}`);

    res.json({ filePath: publicUrl });
  });

  app.get("/api/notices", async (req, res) => {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("date", { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/notices", async (req, res) => {
    const { title, content } = req.body;
    const { data, error } = await supabase
      .from("notices")
      .insert([{ title, content }])
      .select();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ id: data[0].id });
  });

  app.delete("/api/notices/:id", async (req, res) => {
    const { error } = await supabase
      .from("notices")
      .delete()
      .eq("id", req.params.id);
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.get("/api/resources", async (req, res) => {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("date", { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/resources", upload.single("file"), async (req: any, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    
    const { name, type } = req.body;
    const fileName = `${Date.now()}-${req.file.originalname}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("uss-assets")
      .upload(`resources/${fileName}`, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (uploadError) return res.status(500).json({ error: uploadError.message });

    const { data: { publicUrl } } = supabase.storage
      .from("uss-assets")
      .getPublicUrl(`resources/${fileName}`);

    const { data, error } = await supabase
      .from("resources")
      .insert([{ name, type, file_path: publicUrl }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ id: data[0].id, filePath: publicUrl });
  });

  app.delete("/api/resources/:id", async (req, res) => {
    const { data: resource, error: fetchError } = await supabase
      .from("resources")
      .select("file_path")
      .eq("id", req.params.id)
      .single();

    if (fetchError) return res.status(500).json({ error: fetchError.message });

    if (resource) {
      // Extract file path from public URL
      const url = new URL(resource.file_path);
      const pathParts = url.pathname.split("/uss-assets/");
      if (pathParts.length > 1) {
        const storagePath = pathParts[1];
        await supabase.storage.from("uss-assets").remove([storagePath]);
      }

      const { error: deleteError } = await supabase
        .from("resources")
        .delete()
        .eq("id", req.params.id);
      
      if (deleteError) return res.status(500).json({ error: deleteError.message });
    }
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
