import CodeBlock from "@/components/ui/CodeBlock";

/**
 * "In Python" companion for the Vector Spaces lesson: one runnable numpy
 * snippet per definition, so learners can connect each concept to code.
 */
export default function VectorSpacesPythonExamples() {
  return (
    <div className="prose">
      <h2>Working with vector spaces in Python</h2>
      <p>
        Every idea on this page maps directly to a few lines of{" "}
        <code>numpy</code>. The snippets below mirror the definitions — copy
        them into a notebook and experiment.
      </p>

      <h3>Vectors and the axioms</h3>
      <p>
        A vector in <code>R^n</code> is just a 1-D array. Addition and scalar
        multiplication are element-wise, and the axioms can be checked
        numerically.
      </p>
      <CodeBlock
        title="vectors_and_axioms.py"
        code={`import numpy as np

# Vectors live in R^n — here, R^3
u = np.array([1.0, 2.0, 3.0])
v = np.array([4.0, 5.0, 6.0])
alpha = 2.0

# Closure: adding or scaling stays in R^3
print(u + v)        # [5. 7. 9.]
print(alpha * u)    # [2. 4. 6.]

# A few axioms, verified numerically
assert np.allclose(u + v, v + u)                          # commutativity
assert np.allclose(alpha * (u + v), alpha*u + alpha*v)    # distributivity
assert np.allclose(u + np.zeros(3), u)                    # additive identity
print("all axioms hold")`}
      />

      <h3>Subspaces</h3>
      <p>
        A subspace must contain the zero vector and be closed under addition and
        scalar multiplication. The <code>xy</code>-plane inside{" "}
        <code>R^3</code> is a classic example.
      </p>
      <CodeBlock
        title="subspaces.py"
        code={`import numpy as np

# The xy-plane is a subspace of R^3: { (x, y, 0) }
def in_xy_plane(w):
    return np.isclose(w[2], 0.0)

a = np.array([1.0, -2.0, 0.0])
b = np.array([3.0,  4.0, 0.0])

assert in_xy_plane(a + b)        # closed under addition
assert in_xy_plane(5.0 * a)      # closed under scaling
assert in_xy_plane(np.zeros(3))  # contains the zero vector
print("xy-plane is a subspace")`}
      />

      <h3>Span and linear independence</h3>
      <p>
        Stack vectors as columns of a matrix; the <code>rank</code> tells you how
        many are independent. If the rank is less than the number of vectors,
        one is a linear combination of the others.
      </p>
      <CodeBlock
        title="independence.py"
        code={`import numpy as np

v1 = np.array([1.0, 0.0, 0.0])
v2 = np.array([0.0, 1.0, 0.0])
v3 = np.array([1.0, 1.0, 0.0])   # v3 = v1 + v2

M = np.column_stack([v1, v2, v3])
rank = np.linalg.matrix_rank(M)

print(rank)                       # 2
print("independent?", rank == M.shape[1])   # False`}
      />

      <h3>Basis and dimension</h3>
      <p>
        A basis is a maximal independent set; its size is the dimension. Given a
        basis, any vector has unique coordinates found by solving a linear
        system.
      </p>
      <CodeBlock
        title="basis_and_dimension.py"
        code={`import numpy as np

# Standard basis for R^3
basis = np.eye(3)                       # columns e1, e2, e3

# Dimension = number of independent basis vectors = rank
print(np.linalg.matrix_rank(basis))     # 3

# Coordinates of x in this basis: solve  basis @ c = x
x = np.array([2.0, -1.0, 4.0])
coords = np.linalg.solve(basis, x)
print(coords)                           # [ 2. -1.  4.]`}
      />

      <h3>Why it matters: vectors in Transformers</h3>
      <p>
        A token embedding is a vector in <code>R^d</code>, and a residual
        connection is literally vector addition — the same axioms at work.
      </p>
      <CodeBlock
        title="transformer_vectors.py"
        code={`import numpy as np

d_model = 8
x = np.random.randn(d_model)   # a token embedding in R^d

def layer(z):
    W = np.random.randn(d_model, d_model) * 0.1
    return np.tanh(z @ W)

# Residual connection: x + Layer(x) stays in the same vector space
y = x + layer(x)
print(y.shape)                 # (8,)`}
      />
    </div>
  );
}
